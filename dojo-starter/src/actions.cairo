const INITIAL_AP: u8 = 3;
const INITIAL_HP: u8 = 3;
const INITIAL_RANGE: u8 = 2;
const X_RANGE: u128 = 11; // These need to be u128
const Y_RANGE: u128 = 11; // These need to be u128
const ORIGIN_OFFSET: u8 = 22; // Origin offset

// define the interface
#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState, start_time: felt252, username: felt252, game_id: felt252);
    fn startMatch(self: @TContractState, game_id: felt252, playersSpawned: u8, startTime: felt252);
    fn move(self: @TContractState, timestamp: felt252, game_id: felt252, dir: dojo_examples::models::Direction);
    fn leaveGame(self: @TContractState, timeStamp: felt252, game_id: felt252);
    fn increaseRange(self: @TContractState, game_id: felt252, startTime: felt252);
    fn claimActionPoint(self: @TContractState, game_id: felt252, timestamp: u64);
    fn sendActionPoint(self: @TContractState, game_id: felt252, timestamp: felt252, recipient_id: u8);
    fn attack(self: @TContractState, timestamp: u64, target_id: u8, game_id: felt252);
    fn claimVotingPoint(self: @TContractState, game_id: felt252, timestamp: u64);
    fn vote(self: @TContractState, game_id: felt252, timestamp: felt252, recipient_id: u8);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use dojo_examples::models::{
        Position, PlayerId, PlayerAddress, Direction, GameSession, PieceType, Square, Health, Range,
        ActionPoint, VotingPoint, Alive, Player, InGame, Username, GameData, GAME_DATA_KEY, PlayerAtPosition, 
        LastActionPointClaim, LastVotingPointClaim
    };
    use dojo_examples::utils::next_position;
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
        RangeIncreased: RangeIncreased,
        ActionPointClaimed: ActionPointClaimed,
        VotingPointClaimed: VotingPointClaimed,
        ActionPointSent: ActionPointSent,
        Voted: Voted,
        AttackExecuted: AttackExecuted,
        PlayerKilled: PlayerKilled,
        GameEnded: GameEnded,
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
        at: Coordinate,
        gameId: felt252,
        player: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct PlayerMoved {
        timestamp: felt252,
        from: Coordinate,
        to: Coordinate,
        gameId: felt252,
        player: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct RangeIncreased {
        timestamp: felt252,
        gameId: felt252,
        player: felt252,
        newRange: u8,
    }
   
    #[derive(Drop, starknet::Event)]
    struct ActionPointClaimed {
        timestamp: u64,
        gameId: felt252,
        player: felt252,
    }
    
    #[derive(Drop, starknet::Event)]
    struct VotingPointClaimed {
        timestamp: u64,
        gameId: felt252,
        player: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct ActionPointSent {
        timestamp: felt252,
        gameId: felt252,
        sender: felt252,
        reciever: felt252,
    }
 
    #[derive(Drop, starknet::Event)]
    struct Voted {
        timestamp: felt252,
        gameId: felt252,
        voter: felt252,
        receiver: felt252,
    }
    
    #[derive(Drop, starknet::Event)]
    struct PlayerKilled {
        timestamp: u64,
        gameId: felt252,
        killer: felt252,
        killed: felt252,
    }
  
    #[derive(Drop, starknet::Event)]
    struct AttackExecuted {
        timestamp: u64,
        gameId: felt252,
        attacker: felt252,
        target: felt252,
    }

    #[derive(Drop, starknet::Event)]
    struct GameEnded {
        timestamp: u64,
        gameId: felt252,
        winning_player: felt252,
    }

    // structs
    #[derive(Drop, Serde)]
    struct Coordinate {
        x: u8,
        y: u8,
    }
    // @dev: 
    // 1. Assigns player id
    // 2. Sets player address
    // 3. Sets player id
    fn assign_player_id(world: IWorldDispatcher, num_players: u8, player: ContractAddress) -> u8 {
        let id = num_players;
        set!(world, (PlayerId { player, id }, PlayerAddress { id, player }));
        id
    }

    // @dev: Sets no player at position
    fn clear_player_at_position(world: IWorldDispatcher, x: u8, y: u8, game_id: felt252) {
        set!(world, (PlayerAtPosition { x, y, game_id, id: 0}));
    }

    // @dev: Sets player position and energy
    fn set_player_position(world: IWorldDispatcher, id: u8, x: u8, y: u8, game_id: felt252) {
        set!(world, (
            PlayerAtPosition { x, y, game_id, id }, 
            Position { id, game_id, x, y })
        );
    }

    // @dev: Returns player id at position
    fn is_player_at_position(world: IWorldDispatcher, x: u8, y: u8, game_id: felt252) -> u8 {
        get!(world, (x, y, game_id), (PlayerAtPosition)).id
    }

    fn distance(fromX: u8, fromY: u8, toX: u8, toY: u8) -> u8 {
        let mut deltaX: u8 = 0;
        let mut deltaY: u8 = 0;
    

        if (fromX > toX) {
            deltaX = fromX - toX
        } else {
            deltaX = toX - fromX
        }

        if (fromY > toY) {
            deltaY = fromY - toY
        } else {
            deltaY = toY - fromY
        }
        deltaX + deltaY
    }

    fn spawn_game(world: IWorldDispatcher, game_id: felt252, start_time: felt252) {
            
            set!(
                world,
                (GameSession {
                    id: game_id,
                    isLive: false,
                    startTime: start_time,
                    gameId: game_id,
                    live_players: 1,
                    players: 1,
                    isWon: false
                })
            );

            // set all cells of (11x11) grid to be of Type None
            let mut i: u8 = 0;
            loop {
                if i > 11 {
                    break;
                }
                let mut j: u8 = 0;
                loop {
                    if j > 11 {
                        break;
                    }
                    // set!(world, (Square { game_id: game_id, x: i, y: j, piece: PieceType::None },));
                    set!(
                        world,
                        (Square {
                            x: i, y: j , game_id: game_id, piece: PieceType::None
                        }),
                    );
                    j += 1;
                };
                i += 1;
            }
        }

    fn end_game(world: IWorldDispatcher, timestamp: u64, winning_player: u8, game_id: felt252) {
        let mut game_session = get!(world, game_id, GameSession);
        // get winnning player username
        let winning_player_username = get!(world, (winning_player, game_id), (Username)).value;
        game_session.isWon = true;
        game_session.isLive = false;
        set!(world, (game_session));
        emit!(world, GameEnded { timestamp: timestamp, gameId: game_id, winning_player: winning_player_username});
    }

    fn kill_player(world: IWorldDispatcher, timestamp: u64, player_id: u8, target_id: u8, game_id: felt252) {
        let player_username = get!(world, (player_id, game_id), (Username)).value;
        let target_username = get!(world, (target_id, game_id), (Username)).value;
        set!(world, Alive { id: target_id, game_id: game_id, value: false });
        set!(world, ActionPoint { id: target_id, game_id: game_id, value: 0 });
        set!(world, Range { id: target_id, game_id: game_id, value: 0 });
        set!(world, Health { id: target_id, game_id: game_id, value: 0 });
        // decrement players in game session
        let mut game_session = get!(world, game_id, GameSession);
        game_session.live_players =  game_session.live_players - 1;
        set!(world, (game_session));
        emit!(world, PlayerKilled { timestamp: timestamp, gameId: game_id, killer: player_username, killed: target_username });

        // check if game is over
        let remaining_players = get!(world, game_id, GameSession).live_players;
        if remaining_players == 1 {
            end_game(world, timestamp, player_id, game_id);
        }
    }

    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {

        fn spawn(self: @ContractState, start_time: felt252, username: felt252, game_id: felt252) {

            let world = self.world_dispatcher.read();
            
            // Available spawn coordinates
            let mut spawn_locations = ArrayTrait::<Coordinate>::new();
            spawn_locations.append(Coordinate{ x: 0, y: 0 });
            spawn_locations.append(Coordinate { x: 0, y: 5 });
            spawn_locations.append(Coordinate { x: 0, y: 10 });
            spawn_locations.append(Coordinate { x: 5, y: 0 });
            spawn_locations.append(Coordinate { x: 5, y: 10 });
            spawn_locations.append(Coordinate { x: 10, y: 0 });
            spawn_locations.append(Coordinate { x: 10, y: 5 });
            spawn_locations.append(Coordinate { x: 10, y: 10 });

            // check whether there is already a game session with the given gameId, if not, create one
            let game_session = get!(world, game_id, GameSession);
            if game_session.startTime == 0 {
                'game session not found'.print();
                spawn_game(world, game_id, start_time);
            }

            // game data
            let mut game_data = get!(world, GAME_DATA_KEY, (GameData));
            game_data.claim_interval = 30000;


            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();          
            let mut i: usize = 0;
            loop {
                if i == spawn_locations.len() {
                    break;
                }
                // check whether each of the available coordinates is occupied
                let square = get!(world, (*spawn_locations.at(i).x, *spawn_locations.at(i).y, game_id), Square);
                if square.piece == PieceType::None {
                    // if not occupied, spawn the player at that coordinate\
                    
                    game_data.number_of_players += 1;
                    set!(world, (game_data));

                    // // get player id 
                    let mut player_id = get!(world, player, (PlayerId)).id;

                    // if player id is 0, assign new id
                    if player_id == 0 {
                        // Player not already spawned, prepare ID to assign
                        player_id = assign_player_id(world, game_data.number_of_players, player);
                    } else {
                        // Player already exists, clear old position for new spawn
                        let pos = get!(world, (player_id, game_id), (Position));
                        clear_player_at_position(world, pos.x, pos.y, game_id);
                    }

                    set_player_position(world, player_id, square.x, square.y, game_id);
  
                    let mut game_session = get!(world, game_id, GameSession);
                    game_session.live_players = game_session.live_players + 1;
                    set!(world, (game_session));

                    set!(
                        world,
                        (   
                            Player { player, gameId: game_id },
                            InGame { id: player_id, game_id: game_id, player: player },
                            Square { x: square.x, y: square.y, game_id: game_id, piece: PieceType::Player },
                            Username { id: player_id, game_id: game_id, value: username },
                            Health { id: player_id, game_id: game_id, value: 3 },
                            Range { id: player_id, game_id: game_id, value: 2 },
                            Alive { id: player_id, game_id: game_id, value: true },
                            ActionPoint { id: player_id, game_id: game_id, value: 3 },
                        )
                    );
                    emit!(world, PlayerSpawned { timestamp: start_time, at: Coordinate { x: square.x, y: square.y }, gameId: game_id, player: username });
                    break;
                }
                i += 1;
            };
        }

        // fn leaveGame(self: @ContractState, timeStamp: felt252, game_id: felt252) {
        //     let world = self.world_dispatcher.read();
        //     let player = get_caller_address();
        //     let player_id = get!(world, player, (PlayerId)).id;
        //     let username = get!(world, (player_id, game_id), (Username));
        //     delete!(world, (username));
        // }
        
        fn leaveGame(self: @ContractState, timeStamp: felt252, game_id: felt252) {
            let world = self.world_dispatcher.read();
            let player_address = get_caller_address();
            let player_id = get!(world, player_address, (PlayerId)).id;
            let mut inGame = get!(world, (player_id, game_id), InGame);
            assert(inGame.game_id == game_id, 'Player is not in this game');
            // set inGame gaemId to 0
            inGame.game_id = 0;
            set!(world, (inGame));


            
            // clear old position and set square to None
            // let position = get!(world, (player_id, game_id), (Position));
            // set!(world, (PlayerAtPosition { x: position.x, y: position.y, game_id: game_id, id: 0 }));
            // set!(world, (Square { x: position.x, y: position.y, game_id: game_id, piece: PieceType::None },));
            
            // let username = get!(world, (player_id, game_id), (Username));
            // let player = get!(world, (player_address), (Player));
            // let action_points = get!(world, (player_id, game_id), (ActionPoint));
            // let voting_points = get!(world, (player_id, game_id), (VotingPoint));
            // let last_action_point_claimed = get!(world, (player_id, game_id), (LastActionPointClaim));
            // let last_voting_point_claimed = get!(world, (player_id, game_id), (LastVotingPointClaim));
            // let range = get!(world, (player_id, game_id), (Range));
            // let alive = get!(world, (player_id, game_id), (Alive));
            // let health = get!(world, (player_id, game_id), (Health));
            // // delete all records
            // delete!(world, (inGame));
            // delete!(world, (username, player, action_points, voting_points, range, alive, health, inGame, position, last_action_point_claimed, last_voting_point_claimed));
        }

        fn startMatch(self: @ContractState, game_id: felt252, playersSpawned: u8, startTime: felt252) {
            let world = self.world_dispatcher.read();
            assert(playersSpawned > 1, '2 or more players required');
            assert(get!(world, game_id, GameSession).isLive != true, 'Match already live');
            set!(world, GameSession { id: game_id, isLive: true, startTime: startTime, gameId: game_id, live_players : playersSpawned, players: playersSpawned, isWon: false });
            emit!(world, GameStarted { startTime: startTime, gameId: game_id });
        }

        // Implementation of the move function for the ContractState struct.
        fn move(self: @ContractState, timestamp: felt252, game_id: felt252, dir: Direction) {
            let world = self.world_dispatcher.read();
            assert(get!(world, game_id, GameSession).isLive == true, 'Match not live');
            let player = get_caller_address();
            let player_id = get!(world, player, (PlayerId)).id;
            assert(get!(world, (player_id, game_id), Alive).value == true, 'Player is dead');
            let action_points = get!(world, (player_id, game_id), ActionPoint);
            assert(action_points.value > 0, 'AP required to move');

            let pos = get!(world, (player_id, game_id), (Position));
            let fromX = pos.x;
            let fromY = pos.y;

            // Clear old position
            clear_player_at_position(world, pos.x, pos.y, game_id);

            // Get new position
            let next_pos = next_position(pos, dir);
            let toX = next_pos.x;
            let toY = next_pos.y;

            let max_x: felt252 = 10;
            let max_y: felt252 = 10;
            // assert max x and y
            assert(
                next_pos.x <= max_x.try_into().unwrap() && next_pos.y <= max_y.try_into().unwrap(), 'Out of bounds'
            );

            let adversary = is_player_at_position(world, next_pos.x, next_pos.y, game_id);
            assert(adversary == 0, 'Cell occupied');
            let username = get!(world, (player_id, game_id), (Username)).value;
            set_player_position(world, player_id, next_pos.x, next_pos.y, game_id);
            set!(world, ActionPoint { id: player_id, game_id: game_id, value: action_points.value - 1 });
            emit!(world, PlayerMoved { timestamp: timestamp, from: Coordinate { x: fromX, y: fromY }, to: Coordinate { x: toX, y: toY }, gameId: game_id, player: username });
        }

        fn increaseRange(self: @ContractState, game_id: felt252, startTime: felt252) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            let player_id = get!(world, player, (PlayerId)).id;
            let username = get!(world, (player_id, game_id), (Username)).value;
            assert(get!(world, game_id, GameSession).isLive == true, 'Match not live');
            assert(get!(world, (player_id, game_id), Alive).value == true, 'Player is dead');
            let range = get!(world, (player_id, game_id), Range).value;
            let action_points = get!(world, (player_id, game_id), ActionPoint).value;
            assert(action_points > 0, 'Not enough AP');
            assert(range < 5, 'Range maxed out');
            set!(world, Range { id: player_id, game_id: game_id, value: range + 1 });
            set!(world, ActionPoint { id: player_id, game_id: game_id, value: action_points - 1 });
            emit!(world, RangeIncreased { timestamp: startTime, gameId: game_id, player: username, newRange: range + 1});
        }
        
        fn claimActionPoint(self: @ContractState, game_id: felt252, timestamp: u64) {
            let world = self.world_dispatcher.read();
            assert(get!(world, game_id, GameSession).isLive == true, 'Match not live');
            let player = get_caller_address();
            let player_id = get!(world, player, (PlayerId)).id;
            // check the player is alive
            assert(get!(world, (player_id, game_id), Alive).value == true, 'Dead players cannot claim AP');
            let username = get!(world, (player_id, game_id), (Username)).value;
            // get claim interval from GameData
            let claim_interval = get!(world, GAME_DATA_KEY, (GameData)).claim_interval;
            let last_claimed = get!(world, (player_id, game_id), (LastActionPointClaim)).value;
            // if lastClaimed is equal to 0 this is the first time they are claiming so we can skip the check

            let elapsed_time: u64 = timestamp - last_claimed;
            if last_claimed != 0 {
                assert(elapsed_time > claim_interval, 'Cannot claim yet');
            }
            set!(world, LastActionPointClaim { id: player_id, game_id: game_id, value: timestamp });
            let current_action_points = get!(world, (player_id, game_id), (ActionPoint)).value;
            set!(world, ActionPoint { id: player_id, game_id: game_id, value: current_action_points + 1 });
            emit!(world, ActionPointClaimed { timestamp: timestamp, gameId: game_id, player: username });
        }
        
        fn claimVotingPoint(self: @ContractState, game_id: felt252, timestamp: u64) {
            let world = self.world_dispatcher.read();
            assert(get!(world, game_id, GameSession).isLive == true, 'Match not live');
            let player = get_caller_address();
            let player_id = get!(world, player, (PlayerId)).id;
            // check player is dead
            assert(get!(world, (player_id, game_id), Alive).value == false, 'Live players cannot claim VP');
            let username = get!(world, (player_id, game_id), (Username)).value;
            // get claim interval from GameData
            let claim_interval = get!(world, GAME_DATA_KEY, (GameData)).claim_interval;
            let last_claimed = get!(world, (player_id, game_id), (LastVotingPointClaim)).value;
            // if lastClaimed is equal to 0 this is the first time they are claiming so we can skip the check

            let elapsed_time: u64 = timestamp - last_claimed;
            if last_claimed != 0 {
                assert(elapsed_time > claim_interval, 'Cannot claim yet');
            }
            set!(world, LastVotingPointClaim { id: player_id, game_id: game_id, value: timestamp });
            let current_voting_points = get!(world, (player_id, game_id), (VotingPoint)).value;
            set!(world, VotingPoint { id: player_id, game_id: game_id, value: current_voting_points + 1 });
            emit!(world, VotingPointClaimed { timestamp: timestamp, gameId: game_id, player: username });
        }
        
        fn sendActionPoint(self: @ContractState, game_id: felt252, timestamp: felt252, recipient_id: u8) {
            let world = self.world_dispatcher.read();
            assert(get!(world, game_id, GameSession).isLive == true, 'Match not live');
            let player = get_caller_address();
            let player_id = get!(world, player, (PlayerId)).id;
            
            // check the player is alive
            assert(get!(world, (player_id, game_id), Alive).value == true, 'Player is dead');
            // check the recipient is alive
            assert(get!(world, (recipient_id, game_id), Alive).value == true, 'Recipient is dead');
            // check the recipient is in the same game
            assert(get!(world, (recipient_id, game_id), InGame).game_id == game_id, 'Recipient not in game');
            
            let position = get!(world, (player_id, game_id), (Position)); 
            let recipient_position = get!(world, (recipient_id, game_id), (Position));
            let range = get!(world, (player_id, game_id), Range).value;
            assert(distance(position.x, position.y, recipient_position.x, recipient_position.y) <= range, 'Recipient out of range');

            // get players action points
            let action_points = get!(world, (player_id, game_id), ActionPoint).value;
            assert(action_points > 0, 'Not enough AP');
            // get recipient action points
            let recipient_action_points = get!(world, (recipient_id, game_id), ActionPoint).value; 
            set!(world, ActionPoint { id: player_id, game_id: game_id, value: action_points - 1 });
            set!(world, ActionPoint { id: recipient_id, game_id: game_id, value: recipient_action_points + 1 });

            let username = get!(world, (player_id, game_id), (Username)).value;
            let recipient_username = get!(world, (recipient_id, game_id), (Username)).value;
            emit!(world, ActionPointSent { timestamp: timestamp, gameId: game_id, sender: username, reciever: recipient_username });
        }
        
        fn vote(self: @ContractState, game_id: felt252, timestamp: felt252, recipient_id: u8) {
            let world = self.world_dispatcher.read();
            assert(get!(world, game_id, GameSession).isLive == true, 'Match not live');
            let player = get_caller_address();
            let player_id = get!(world, player, (PlayerId)).id;
            assert(get!(world, (player_id, game_id), Alive).value == false, 'Live players cannot vote');
            assert(get!(world, (recipient_id, game_id), Alive).value == true, 'Can only vote for live players');
            assert(get!(world, (recipient_id, game_id), InGame).game_id == game_id, 'Recipient not in game');
            
            // get players voting points
            let voting_points = get!(world, (player_id, game_id), VotingPoint).value;
            assert(voting_points > 0, 'Need VP to vote');
            // get recipient action points
            let recipient_action_points = get!(world, (recipient_id, game_id), ActionPoint).value; 
            set!(world, VotingPoint { id: player_id, game_id: game_id, value: voting_points - 1 });
            set!(world, ActionPoint { id: recipient_id, game_id: game_id, value: recipient_action_points + 1 });

            let username = get!(world, (player_id, game_id), (Username)).value;
            let recipient_username = get!(world, (recipient_id, game_id), (Username)).value;
            emit!(world, Voted { timestamp: timestamp, gameId: game_id, voter: username, receiver: recipient_username });
        }

        fn attack(self: @ContractState, timestamp: u64, target_id: u8, game_id: felt252) {
            let world = self.world_dispatcher.read();
            assert(get!(world, game_id, GameSession).isLive == true, 'Match not live');
            let player = get_caller_address();
            let player_id = get!(world, player, (PlayerId)).id;
            assert(get!(world, (player_id, game_id), Alive).value == true, 'Player is dead');
            assert(get!(world, (target_id, game_id), Alive).value == true, 'Target is dead');
            // check the target is in the same game
            assert(get!(world, (target_id, game_id), InGame).game_id == game_id, 'Target not in game'); // this might not work

            // check player has an action point
            let action_points = get!(world, (player_id, game_id), ActionPoint).value;
            assert(action_points > 0, 'Not enough AP');

            // check target is in range
            let position = get!(world, (player_id, game_id), (Position)); 
            let target_position = get!(world, (target_id, game_id), (Position));
            let range = get!(world, (player_id, game_id), Range).value;
            assert(distance(position.x, position.y, target_position.x, target_position.y) <= range, 'Target out of range');

            set!(world, ActionPoint { id: player_id, game_id: game_id, value: action_points - 1 });
            let target_health = get!(world, (target_id, game_id), Health).value; 
            set!(world, Health { id: target_id, game_id: game_id, value: target_health - 1 });

            let username = get!(world, (player_id, game_id), (Username)).value;
            let target_username = get!(world, (target_id, game_id), (Username)).value;
            emit!(world, AttackExecuted { timestamp: timestamp, gameId: game_id, attacker: username, target: target_username });

            let target_health = get!(world, (target_id, game_id), Health).value; 
            if target_health == 0 {
                kill_player(world, timestamp, player_id, target_id, game_id);
            }
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
        PlayerId, player_id,
        Username, username, 
        Position, position,
        GameSession,
        PieceType, 
        Square, square,
        Health, health,
        Range, range,
        ActionPoint, action_point,
        Alive, alive,
    };
    use super::{actions, IActionsDispatcher, IActionsDispatcherTrait};



    // #[test]
    // #[available_gas(3000000000000000)]
    // fn test_spawn_game() {
    //     let caller = starknet::contract_address_const::<0x0>();
    //     let mut models = array![position::TEST_CLASS_HASH];
    //     let world = spawn_test_world(models);
    //     // deploy systems contract
    //     let contract_address = world
    //         .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
    //     let actions_system = IActionsDispatcher { contract_address };
    //     // spawn new game session

    //     let game_id: felt252 = 123456;
    //     let start_time: felt252 = 1699744590;
    //     actions_system.spawn_game(game_id, start_time);
    //     // check the GameSession was created correctly
    //     let game_session = get!(world, game_id, GameSession);
    //     assert(game_session.startTime == start_time, 'start time is wrong');
    //     // Check a selection of cells to make sure their piece is None
    //     let square = get!(world, (0, 0, game_id), Square);
    //     assert(square.piece == PieceType::None, 'piece is wrong');
    // }

    // #[test]
    // #[available_gas(3000000000000000)]
    // fn test_spawn() {
    //     let caller = starknet::contract_address_const::<0x0>();
    //     let caller_2 = starknet::contract_address_const::<0x1>();
    //     let mut models = array![
    //         position::TEST_CLASS_HASH,
    //         health::TEST_CLASS_HASH,
    //         range::TEST_CLASS_HASH,
    //         alive::TEST_CLASS_HASH
    //     ];
    //     let world = spawn_test_world(models);
    //     // deploy systems contract
    //     let contract_address = world
    //         .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
    //     let actions_system = IActionsDispatcher { contract_address };

    //     let game_id: felt252 = 123456;
    //     let start_time: felt252 = 1699744590;
    //     let username1: felt252 = 'test_user1';
    //     let username2: felt252 = 'test_user2';
    //     // actions_system.spawn_game(game_id, start_time);

    //     // Spawn two different players then check their start positions are correct
    //     testing::set_contract_address(caller);
    //     actions_system.spawn(start_time, username1, game_id);
    //     testing::set_contract_address(caller_2);
    //     actions_system.spawn(start_time, username2, game_id);
    //     let position = get!(world, (caller, game_id), Position);
    //     assert(position.x == 0, 'position x is wrong for caller1');
    //     assert(position.y == 0, 'position y is wrong for caller1');
    //     let position = get!(world, (caller_2, game_id), Position);
    //     position.print();
    //     assert(position.x == 0, 'position x is wrong for caller2');
    //     assert(position.y == 5, 'position y is wrong for caller2');

    //     // check other player stats are initialised correctly
    //     let health = get!(world, caller, Health);
    //     assert(health.value == 3, 'health points should equal 3');
    //     let range = get!(world, caller, Range);
    //     assert(range.value == 2, 'range points should equal 2');
    //     let alive = get!(world, caller, Alive);
    //     assert(alive.value == true, 'alive should be true');
    //     let action_points = get!(world, caller, ActionPoint);
    //     assert(action_points.value == 3, 'action points should equal 3');
    // }

    #[test]
    #[available_gas(3000000000000000)]
    fn test_leaveGame() {
        //setup
        let caller = starknet::contract_address_const::<0x0>();
        let mut models = array![
            position::TEST_CLASS_HASH,
            health::TEST_CLASS_HASH,
            range::TEST_CLASS_HASH,
            alive::TEST_CLASS_HASH
        ];
        let world = spawn_test_world(models);
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        // spawn
        let game_id: felt252 = 123456;
        let start_time: felt252 = 1699744590;
        let username1: felt252 = 'test_user1';
        testing::set_contract_address(caller);
        actions_system.spawn(start_time, username1, game_id);
        
        let player_id = get!(world, caller, (PlayerId)).id;
        let username_before = get!(world, (player_id, game_id), (Username)).value;
        'username before leaving game'.print();
        username_before.print();
        // leave game
        actions_system.leaveGame(1699744590, game_id);
        let username_after = get!(world, (player_id, game_id), (Username)).value;
        'username after leaving game'.print();
        username_after.print();
    }
    
    // #[test]
    // #[available_gas(3000000000000000)]
    // fn test_move() {
    //     // set up world
    //     // let mut models = array![position::TEST_CLASS_HASH, action_point::TEST_CLASS_HASH];
    //     let mut models = array![
    //         player::TEST_CLASS_HASH,
    //         username::TEST_CLASS_HASH,
    //         position::TEST_CLASS_HASH,
    //         square::TEST_CLASS_HASH,
    //         health::TEST_CLASS_HASH,
    //         range::TEST_CLASS_HASH,
    //         alive::TEST_CLASS_HASH,
    //         action_point::TEST_CLASS_HASH,
    //     ];
    //     let world = spawn_test_world(models);
    //     let contract_address = world
    //         .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
    //     let actions_system = IActionsDispatcher { contract_address };

    //     let caller_1 = starknet::contract_address_const::<0x0>();
    //     let caller_2 = starknet::contract_address_const::<0x1>();
        
    //     let game_id: felt252 = 123456;
    //     let start_time: felt252 = 1699744590;
    //     let username1: felt252 = 'test_user1';
    //     let username2: felt252 = 'test_user2';

    //     actions_system.spawn_game(game_id, 1699744590);

    //     testing::set_contract_address(caller_1);
    //     actions_system.spawn(start_time, username1, game_id);
        
    //     testing::set_contract_address(caller_2);
    //     actions_system.spawn(start_time, username2, game_id);

    //     // start match
    //     actions_system.startMatch(game_id, 2, start_time);

        
    //     // set position to (0, 0)
    //     let mut player_id = get!(world, player, (PlayerID)).id;
    //     set!(world, (Position { id: player_id, game_id: game_id, x: 0, y: 1},));
    //     let position = get!(world, (caller_1, game_id), Position);
    //     position.x.print();
    //     assert(position.x == 0, 'spawn position x is wrong');
    //     assert(position.y == 0, 'spawn position y is wrong');

    //     // call move with direction right and check new position
    //     actions_system.move(1699744590, 1, 0, game_id);
    //     let new_position = get!(world, (caller_1, game_id), Position);
    //     assert(new_position.x == 1, 'position x is wrong');
    //     assert(new_position.y == 0, 'position y is wrong');

    //     // check new square has piece type player
    //     let square = get!(world, (1, 0, game_id), Square);
    //     assert(square.piece == PieceType::Player, 'piece is wrong');

    //     // check old square now has piece type None
    //     let square = get!(world, (0, 0, game_id), Square);
    //     assert(square.piece == PieceType::None, 'piece is wrong');

    //     // check player actions points have been reduced by 1
    //     // let action_points = get!(world, caller, ActionPoint);
    //     // 'action_points'.print();
    //     // action_points.print();
    //     // assert(action_points.ap == 2, 'action points should equal 2');
    // }

}
