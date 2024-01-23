const INITIAL_AP: u8 = 3;
const INITIAL_HP: u8 = 3;
const INITIAL_RANGE: u8 = 2;
const X_RANGE: u128 = 11; // These need to be u128
const Y_RANGE: u128 = 11; // These need to be u128
const ORIGIN_OFFSET: u8 = 22; // Origin offset

// define the interface
#[starknet::interface]
trait IActions<TContractState> {
    fn spawn_game(self: @TContractState, game_id: felt252, start_time: felt252);
    fn spawn(self: @TContractState, start_time: felt252, username: felt252, game_id: felt252);
    fn startMatch(self: @TContractState, game_id: felt252, playersSpawned: u8, startTime: felt252);
    fn move(self: @TContractState, timestamp: felt252, deltaX: u32, deltaY: u32, game_id: felt252);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use dojo_examples::models::{
        Position, Direction, Vec2, GameSession, PieceType, Square, Health, Range,
        ActionPoint, Alive, Player, InGame, Username, GameData, GAME_DATA_KEY, PlayerAtPosition
    };
    use dojo_examples::utils::{next_position};
    use super::{
        IActions, ORIGIN_OFFSET, INITIAL_AP, INITIAL_HP, INITIAL_RANGE, X_RANGE, Y_RANGE
    };
    use debug::PrintTrait;

    // declaring custom event enum
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameStarted: GameStarted,
        Log: Log,
        PlayerSpawned: PlayerSpawned,
        PlayerMoved: PlayerMoved,
    }

    // custom event structs

    #[derive(Drop, starknet::Event)]
    struct Log {
        message: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct GameStarted {
        startTime: felt252,
        gameId: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerSpawned {
        timestamp: felt252,
        position: Vec2,
        gameId: felt252,
        player: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerMoved {
        timestamp: felt252,
        from: Vec2,
        to: Vec2,
        gameId: felt252,
        player: felt252,
    }

    // fn isValidDelta(self: @ContractState, deltaX: u32, deltaY: u32) -> bool {

       
    //     let deltaXValid = (deltaX == 1 || deltaX == -1 || deltaX == 0);
    //     let deltaYValid = (deltaY == 1 || deltaY == -1 || deltaY == 0);
    //     // Ensure that if one is non-zero, the other must be zero
    //     let deltaValid = (deltaX != 0 && deltaY == 0) || (deltaY != 0 && deltaX == 0);
    //     return deltaXValid && deltaYValid && deltaValid;
    // }

    // fn checkForValidMove(self: @ContractState, fromX: u32, fromY: u32, deltaX: u32, deltaY: u32) -> bool {
    //     let world = self.world_dispatcher.read();
    //     // get board width and height
    //     let board_width = get!(world, game_id, GameData).board_width;
    //     let board_height = get!(world, game_id, GameData).board_height;
    //     // check if move is within board bounds
    //     if (fromX + deltaX) < 0 || (fromX + deltaX) > board_width || (fromY + deltaY) < 0 || (fromY + deltaY) > board_height {
    //         return false;
    //     }
    //     true
    // }

    // impl: implement functions specified in trait
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {

        fn spawn_game(self: @ContractState, game_id: felt252, start_time: felt252) {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();
            set!(
                world,
                (GameSession {
                    id: game_id,
                    isLive: false,
                    startTime: start_time,
                    gameId: game_id,
                    players: 1,
                    isWon: false
                })
            );

            // set all cells of (11x11) grid to be of Type None
            let mut i: usize = 0;
            loop {
                if i > 11 {
                    break;
                }
                let mut j: usize = 0;
                loop {
                    if j > 11 {
                        break;
                    }
                    // set!(world, (Square { game_id: game_id, x: i, y: j, piece: PieceType::None },));
                    set!(
                        world,
                        (Square {
                            game_id: game_id, vec: Vec2 { x: i, y: j }, piece: PieceType::None
                        }),
                    );
                    j += 1;
                };
                i += 1;
            }
        }

        fn spawn(self: @ContractState, start_time: felt252, username: felt252, game_id: felt252) {

            let world = self.world_dispatcher.read();
            
            // Available spawn coordinates
            let mut spawn_locations = ArrayTrait::<Vec2>::new();
            spawn_locations.append(Vec2 { x: 0, y: 0 });
            spawn_locations.append(Vec2 { x: 0, y: 5 });
            spawn_locations.append(Vec2 { x: 0, y: 10 });
            spawn_locations.append(Vec2 { x: 5, y: 0 });
            spawn_locations.append(Vec2 { x: 5, y: 10 });
            spawn_locations.append(Vec2 { x: 10, y: 0 });
            spawn_locations.append(Vec2 { x: 10, y: 5 });
            spawn_locations.append(Vec2 { x: 10, y: 10 });

            // check whether there is already a game session with the given gameId, if not, create one
            let game_session = get!(world, game_id, GameSession);
            if game_session.startTime == 0 {
                'game session not found'.print();
                self.spawn_game(game_id, start_time);
            }

            // game data
            // let mut game_data = get!(world, GAME_DATA_KEY, (GameData));
            // let 

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();          
            let mut i: usize = 0;
            loop {
                if i == spawn_locations.len() {
                    break;
                }
                // check whether each of the available coordinates is occupied
                let square = get!(world, (game_id, *spawn_locations.at(i)), Square);
                if square.piece == PieceType::None {
                    // if not occupied, spawn the player at that coordinate\
                    
                    // game_data.number_of_players += 1;
                    // set!(world, (game_data));

                    // // get player id 
                    // let mut player_id = get!(world, player, (PlayerID)).id;

                    // // if player id is 0, assign new id
                    // if player_id == 0 {
                    //     // Player not already spawned, prepare ID to assign
                    //     player_id = assign_player_id(world, game_data.number_of_players, player);
                    // } else {
                    //     // Player already exists, clear old position for new spawn
                    //     let pos = get!(world, player_id, (Position));
                    //     clear_player_at_position(world, pos.x, pos.y);
                    // }

                    set!(
                        world,
                        (   
                            Player { player, gameId: game_id },
                            Username { player, value: username },
                            InGame { player, gameId: game_id },
                            Position { player, game_id, vec: square.vec },
                            Square { game_id: game_id, vec: square.vec, piece: PieceType::Player },
                            Health { player, value: 3 },
                            Range { player, value: 2 },
                            Alive { player, value: true },
                            ActionPoint { player, value: 3 },
                        )
                    );
                    emit!(world, PlayerSpawned { timestamp: start_time, position: square.vec, gameId: game_id, player: username });
                    break;
                }
                i += 1;
            };
        }

        fn startMatch(self: @ContractState, game_id: felt252, playersSpawned: u8, startTime: felt252) {
            let world = self.world_dispatcher.read();
            assert(playersSpawned > 1, '2 or more players required');
            assert(get!(world, game_id, GameSession).isLive != true, 'Match already started');
            set!(world, GameSession { id: game_id, isLive: true, startTime: startTime, gameId: game_id, players: playersSpawned, isWon: false });
            emit!(world, GameStarted { startTime: startTime, gameId: game_id });
        }

        // Implementation of the move function for the ContractState struct.
        fn move(self: @ContractState, timestamp: felt252, deltaX: u32, deltaY: u32, game_id: felt252) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            assert(get!(world, game_id, GameSession).isLive == true, 'Match not started');
            assert(get!(world, player, Alive).value == true, 'Player is dead');
            let action_points = get!(world, player, ActionPoint);
            assert(action_points.value > 0, 'AP required to move');
            let mut position = get!(world, (player, game_id), Position);
            let fromX: u32 = position.vec.x;
            let fromY: u32 = position.vec.y;
            let toX: u32 = fromX + deltaX;
            let toY: u32 = fromY + deltaY;

            // check if move is within board bounds
            let max_x: felt252 = ORIGIN_OFFSET.into() + X_RANGE.into();
            let max_y: felt252 = ORIGIN_OFFSET.into() + Y_RANGE.into();
            assert(toX <= max_x.try_into().unwrap() && toY<= max_y.try_into().unwrap(), 'Out of bounds');



            // assert(isValidDelta(deltaX, deltaY), 'Invalid move');
            // assert(checkForValidMove(fromX, fromY, deltaX, deltaY), 'Invalid move');

            // check whether the square the player is moving to is occupied
            let target_square = get!(world, (game_id, Vec2 { x: toX, y: toY }), Square);
            assert(target_square.piece == PieceType::None, 'Target square is occupied');
            // target square is unoccupied, so move player to it
            set!(world, (Square { game_id: game_id, vec: Vec2 { x: toX, y: toY }, piece: PieceType::Player },));
            // set the square the player is moving from to be unoccupied
            set!(world, (Square { game_id: game_id, vec: Vec2 { x: fromX, y: fromY }, piece: PieceType::None },));
            // emit event to notify of player move
            // get player username
            let username = get!(world, player, Username).value;
            emit!(world, PlayerMoved { timestamp: timestamp, from: Vec2 { x: fromX, y: fromY }, to: Vec2 { x: toX, y: toY }, gameId: game_id, player: username });
        }
    }
}

#[cfg(test)]
mod tests {
    use starknet::{class_hash::Felt252TryIntoClassHash, testing};
    use debug::PrintTrait;
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
    use dojo::test_utils::{spawn_test_world, deploy_contract};
    // use dojo_examples::models::{player, username, position, health, range, action_point, alive};
    use dojo_examples::models::{
        Player, player,
        Username, username, 
        Position, position,
        Vec2,
        GameSession,
        PieceType, 
        Square, square,
        Health, health,
        Range, range,
        ActionPoint, action_point,
        Alive, alive,
    };
    use super::{actions, IActionsDispatcher, IActionsDispatcherTrait};



    #[test]
    #[available_gas(3000000000000000)]
    fn test_spawn_game() {
        let caller = starknet::contract_address_const::<0x0>();
        let mut models = array![position::TEST_CLASS_HASH];
        let world = spawn_test_world(models);
        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };
        // spawn new game session

        let game_id: felt252 = 123456;
        let start_time: felt252 = 1699744590;
        actions_system.spawn_game(game_id, start_time);
        // check the GameSession was created correctly
        let game_session = get!(world, game_id, GameSession);
        assert(game_session.startTime == start_time, 'start time is wrong');
        // Check a selection of cells to make sure their piece is None
        let square = get!(world, (game_id, Vec2 { x: 0, y: 0 }), Square);
        assert(square.piece == PieceType::None, 'piece is wrong');
    }

    #[test]
    #[available_gas(3000000000000000)]
    fn test_spawn() {
        let caller = starknet::contract_address_const::<0x0>();
        let caller_2 = starknet::contract_address_const::<0x1>();
        let mut models = array![
            position::TEST_CLASS_HASH,
            health::TEST_CLASS_HASH,
            range::TEST_CLASS_HASH,
            alive::TEST_CLASS_HASH
        ];
        let world = spawn_test_world(models);
        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        let game_id: felt252 = 123456;
        let start_time: felt252 = 1699744590;
        let username1: felt252 = 'test_user1';
        let username2: felt252 = 'test_user2';
        actions_system.spawn_game(game_id, start_time);

        // Spawn two different players then check their start positions are correct
        testing::set_contract_address(caller);
        actions_system.spawn(start_time, username1, game_id);
        testing::set_contract_address(caller_2);
        actions_system.spawn(start_time, username2, game_id);
        let position = get!(world, (caller, game_id), Position);
        assert(position.vec.x == 0, 'position x is wrong for caller1');
        assert(position.vec.y == 0, 'position y is wrong for caller1');
        let position = get!(world, (caller_2, game_id), Position);
        position.print();
        assert(position.vec.x == 0, 'position x is wrong for caller2');
        assert(position.vec.y == 5, 'position y is wrong for caller2');

        // check other player stats are initialised correctly
        let health = get!(world, caller, Health);
        assert(health.value == 3, 'health points should equal 3');
        let range = get!(world, caller, Range);
        assert(range.value == 2, 'range points should equal 2');
        let alive = get!(world, caller, Alive);
        assert(alive.value == true, 'alive should be true');
        let action_points = get!(world, caller, ActionPoint);
        assert(action_points.value == 3, 'action points should equal 3');
    }

    #[test]
    #[available_gas(3000000000000000)]
    fn test_move() {
        // set up world
        // let mut models = array![position::TEST_CLASS_HASH, action_point::TEST_CLASS_HASH];
        let mut models = array![
            player::TEST_CLASS_HASH,
            username::TEST_CLASS_HASH,
            position::TEST_CLASS_HASH,
            square::TEST_CLASS_HASH,
            health::TEST_CLASS_HASH,
            range::TEST_CLASS_HASH,
            alive::TEST_CLASS_HASH,
            action_point::TEST_CLASS_HASH,
        ];
        let world = spawn_test_world(models);
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        let caller_1 = starknet::contract_address_const::<0x0>();
        let caller_2 = starknet::contract_address_const::<0x1>();
        
        let game_id: felt252 = 123456;
        let start_time: felt252 = 1699744590;
        let username1: felt252 = 'test_user1';
        let username2: felt252 = 'test_user2';

        actions_system.spawn_game(game_id, 1699744590);

        testing::set_contract_address(caller_1);
        actions_system.spawn(start_time, username1, game_id);
        
        testing::set_contract_address(caller_2);
        actions_system.spawn(start_time, username2, game_id);

        // start match
        actions_system.startMatch(game_id, 2, start_time);

        
        // set position to (0, 0)
        set!(world, (Position { player: caller_1, game_id: game_id, vec: Vec2 { x: 0, y: 1 } },));
        let position = get!(world, (caller_1, game_id), Position);
        position.vec.print();
        assert(position.vec.x == 0, 'spawn position x is wrong');
        assert(position.vec.y == 0, 'spawn position y is wrong');

        // call move with direction right and check new position
        actions_system.move(1699744590, 1, 0, game_id);
        let new_position = get!(world, (caller_1, game_id), Position);
        assert(new_position.vec.x == 1, 'position x is wrong');
        assert(new_position.vec.y == 0, 'position y is wrong');

        // check new square has piece type player
        let square = get!(world, (game_id, Vec2 { x: 1, y: 0 }), Square);
        assert(square.piece == PieceType::Player, 'piece is wrong');

        // check old square now has piece type None
        let square = get!(world, (game_id, Vec2 { x: 0, y: 0 }), Square);
        assert(square.piece == PieceType::None, 'piece is wrong');

        // check player actions points have been reduced by 1
        // let action_points = get!(world, caller, ActionPoint);
        // 'action_points'.print();
        // action_points.print();
        // assert(action_points.ap == 2, 'action points should equal 2');
    }

}
