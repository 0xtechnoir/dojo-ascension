import { useFetchData } from '../hooks/fetcher';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ContractAddress: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Enum: { input: any; output: any; }
  bool: { input: any; output: any; }
  felt252: { input: any; output: any; }
  u8: { input: any; output: any; }
  u32: { input: any; output: any; }
};

export type ActionPoint = {
  __typename?: 'ActionPoint';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['u8']['output']>;
};

export type ActionPointConnection = {
  __typename?: 'ActionPointConnection';
  edges?: Maybe<Array<Maybe<ActionPointEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ActionPointEdge = {
  __typename?: 'ActionPointEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<ActionPoint>;
};

export type ActionPointOrder = {
  direction: OrderDirection;
  field: ActionPointOrderField;
};

export enum ActionPointOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type ActionPointWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['u8']['input']>;
  valueEQ?: InputMaybe<Scalars['u8']['input']>;
  valueGT?: InputMaybe<Scalars['u8']['input']>;
  valueGTE?: InputMaybe<Scalars['u8']['input']>;
  valueLT?: InputMaybe<Scalars['u8']['input']>;
  valueLTE?: InputMaybe<Scalars['u8']['input']>;
  valueNEQ?: InputMaybe<Scalars['u8']['input']>;
};

export type Alive = {
  __typename?: 'Alive';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['bool']['output']>;
};

export type AliveConnection = {
  __typename?: 'AliveConnection';
  edges?: Maybe<Array<Maybe<AliveEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AliveEdge = {
  __typename?: 'AliveEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Alive>;
};

export type AliveOrder = {
  direction: OrderDirection;
  field: AliveOrderField;
};

export enum AliveOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type AliveWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['bool']['input']>;
};

export type ClaimInterval = {
  __typename?: 'ClaimInterval';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['u32']['output']>;
};

export type ClaimIntervalConnection = {
  __typename?: 'ClaimIntervalConnection';
  edges?: Maybe<Array<Maybe<ClaimIntervalEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type ClaimIntervalEdge = {
  __typename?: 'ClaimIntervalEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<ClaimInterval>;
};

export type ClaimIntervalOrder = {
  direction: OrderDirection;
  field: ClaimIntervalOrderField;
};

export enum ClaimIntervalOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type ClaimIntervalWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['u32']['input']>;
  valueEQ?: InputMaybe<Scalars['u32']['input']>;
  valueGT?: InputMaybe<Scalars['u32']['input']>;
  valueGTE?: InputMaybe<Scalars['u32']['input']>;
  valueLT?: InputMaybe<Scalars['u32']['input']>;
  valueLTE?: InputMaybe<Scalars['u32']['input']>;
  valueNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type GameSession = {
  __typename?: 'GameSession';
  entity?: Maybe<World__Entity>;
  gameId?: Maybe<Scalars['felt252']['output']>;
  id?: Maybe<Scalars['felt252']['output']>;
  isLive?: Maybe<Scalars['bool']['output']>;
  isWon?: Maybe<Scalars['bool']['output']>;
  players?: Maybe<Scalars['u8']['output']>;
  startTime?: Maybe<Scalars['felt252']['output']>;
};

export type GameSessionConnection = {
  __typename?: 'GameSessionConnection';
  edges?: Maybe<Array<Maybe<GameSessionEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type GameSessionEdge = {
  __typename?: 'GameSessionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<GameSession>;
};

export type GameSessionOrder = {
  direction: OrderDirection;
  field: GameSessionOrderField;
};

export enum GameSessionOrderField {
  Gameid = 'GAMEID',
  Id = 'ID',
  Islive = 'ISLIVE',
  Iswon = 'ISWON',
  Players = 'PLAYERS',
  Starttime = 'STARTTIME'
}

export type GameSessionWhereInput = {
  gameId?: InputMaybe<Scalars['felt252']['input']>;
  gameIdEQ?: InputMaybe<Scalars['felt252']['input']>;
  gameIdGT?: InputMaybe<Scalars['felt252']['input']>;
  gameIdGTE?: InputMaybe<Scalars['felt252']['input']>;
  gameIdLT?: InputMaybe<Scalars['felt252']['input']>;
  gameIdLTE?: InputMaybe<Scalars['felt252']['input']>;
  gameIdNEQ?: InputMaybe<Scalars['felt252']['input']>;
  id?: InputMaybe<Scalars['felt252']['input']>;
  idEQ?: InputMaybe<Scalars['felt252']['input']>;
  idGT?: InputMaybe<Scalars['felt252']['input']>;
  idGTE?: InputMaybe<Scalars['felt252']['input']>;
  idLT?: InputMaybe<Scalars['felt252']['input']>;
  idLTE?: InputMaybe<Scalars['felt252']['input']>;
  idNEQ?: InputMaybe<Scalars['felt252']['input']>;
  isLive?: InputMaybe<Scalars['bool']['input']>;
  isWon?: InputMaybe<Scalars['bool']['input']>;
  players?: InputMaybe<Scalars['u8']['input']>;
  playersEQ?: InputMaybe<Scalars['u8']['input']>;
  playersGT?: InputMaybe<Scalars['u8']['input']>;
  playersGTE?: InputMaybe<Scalars['u8']['input']>;
  playersLT?: InputMaybe<Scalars['u8']['input']>;
  playersLTE?: InputMaybe<Scalars['u8']['input']>;
  playersNEQ?: InputMaybe<Scalars['u8']['input']>;
  startTime?: InputMaybe<Scalars['felt252']['input']>;
  startTimeEQ?: InputMaybe<Scalars['felt252']['input']>;
  startTimeGT?: InputMaybe<Scalars['felt252']['input']>;
  startTimeGTE?: InputMaybe<Scalars['felt252']['input']>;
  startTimeLT?: InputMaybe<Scalars['felt252']['input']>;
  startTimeLTE?: InputMaybe<Scalars['felt252']['input']>;
  startTimeNEQ?: InputMaybe<Scalars['felt252']['input']>;
};

export type Health = {
  __typename?: 'Health';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['u8']['output']>;
};

export type HealthConnection = {
  __typename?: 'HealthConnection';
  edges?: Maybe<Array<Maybe<HealthEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type HealthEdge = {
  __typename?: 'HealthEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Health>;
};

export type HealthOrder = {
  direction: OrderDirection;
  field: HealthOrderField;
};

export enum HealthOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type HealthWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['u8']['input']>;
  valueEQ?: InputMaybe<Scalars['u8']['input']>;
  valueGT?: InputMaybe<Scalars['u8']['input']>;
  valueGTE?: InputMaybe<Scalars['u8']['input']>;
  valueLT?: InputMaybe<Scalars['u8']['input']>;
  valueLTE?: InputMaybe<Scalars['u8']['input']>;
  valueNEQ?: InputMaybe<Scalars['u8']['input']>;
};

export type InGame = {
  __typename?: 'InGame';
  entity?: Maybe<World__Entity>;
  gameId?: Maybe<Scalars['felt252']['output']>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
};

export type InGameConnection = {
  __typename?: 'InGameConnection';
  edges?: Maybe<Array<Maybe<InGameEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type InGameEdge = {
  __typename?: 'InGameEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<InGame>;
};

export type InGameOrder = {
  direction: OrderDirection;
  field: InGameOrderField;
};

export enum InGameOrderField {
  Gameid = 'GAMEID',
  Player = 'PLAYER'
}

export type InGameWhereInput = {
  gameId?: InputMaybe<Scalars['felt252']['input']>;
  gameIdEQ?: InputMaybe<Scalars['felt252']['input']>;
  gameIdGT?: InputMaybe<Scalars['felt252']['input']>;
  gameIdGTE?: InputMaybe<Scalars['felt252']['input']>;
  gameIdLT?: InputMaybe<Scalars['felt252']['input']>;
  gameIdLTE?: InputMaybe<Scalars['felt252']['input']>;
  gameIdNEQ?: InputMaybe<Scalars['felt252']['input']>;
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
};

export type LastActionPointClaim = {
  __typename?: 'LastActionPointClaim';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['u32']['output']>;
};

export type LastActionPointClaimConnection = {
  __typename?: 'LastActionPointClaimConnection';
  edges?: Maybe<Array<Maybe<LastActionPointClaimEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LastActionPointClaimEdge = {
  __typename?: 'LastActionPointClaimEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<LastActionPointClaim>;
};

export type LastActionPointClaimOrder = {
  direction: OrderDirection;
  field: LastActionPointClaimOrderField;
};

export enum LastActionPointClaimOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type LastActionPointClaimWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['u32']['input']>;
  valueEQ?: InputMaybe<Scalars['u32']['input']>;
  valueGT?: InputMaybe<Scalars['u32']['input']>;
  valueGTE?: InputMaybe<Scalars['u32']['input']>;
  valueLT?: InputMaybe<Scalars['u32']['input']>;
  valueLTE?: InputMaybe<Scalars['u32']['input']>;
  valueNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type LastVotingPointClaim = {
  __typename?: 'LastVotingPointClaim';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['u32']['output']>;
};

export type LastVotingPointClaimConnection = {
  __typename?: 'LastVotingPointClaimConnection';
  edges?: Maybe<Array<Maybe<LastVotingPointClaimEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type LastVotingPointClaimEdge = {
  __typename?: 'LastVotingPointClaimEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<LastVotingPointClaim>;
};

export type LastVotingPointClaimOrder = {
  direction: OrderDirection;
  field: LastVotingPointClaimOrderField;
};

export enum LastVotingPointClaimOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type LastVotingPointClaimWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['u32']['input']>;
  valueEQ?: InputMaybe<Scalars['u32']['input']>;
  valueGT?: InputMaybe<Scalars['u32']['input']>;
  valueGTE?: InputMaybe<Scalars['u32']['input']>;
  valueLT?: InputMaybe<Scalars['u32']['input']>;
  valueLTE?: InputMaybe<Scalars['u32']['input']>;
  valueNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type ModelUnion = ActionPoint | Alive | ClaimInterval | GameSession | Health | InGame | LastActionPointClaim | LastVotingPointClaim | Moves | Player | Position | Range | Square | Username | VotingPoint;

export type Moves = {
  __typename?: 'Moves';
  entity?: Maybe<World__Entity>;
  last_direction?: Maybe<Scalars['Enum']['output']>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  remaining?: Maybe<Scalars['u8']['output']>;
};

export type MovesConnection = {
  __typename?: 'MovesConnection';
  edges?: Maybe<Array<Maybe<MovesEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type MovesEdge = {
  __typename?: 'MovesEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Moves>;
};

export type MovesOrder = {
  direction: OrderDirection;
  field: MovesOrderField;
};

export enum MovesOrderField {
  LastDirection = 'LAST_DIRECTION',
  Player = 'PLAYER',
  Remaining = 'REMAINING'
}

export type MovesWhereInput = {
  last_direction?: InputMaybe<Scalars['Enum']['input']>;
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  remaining?: InputMaybe<Scalars['u8']['input']>;
  remainingEQ?: InputMaybe<Scalars['u8']['input']>;
  remainingGT?: InputMaybe<Scalars['u8']['input']>;
  remainingGTE?: InputMaybe<Scalars['u8']['input']>;
  remainingLT?: InputMaybe<Scalars['u8']['input']>;
  remainingLTE?: InputMaybe<Scalars['u8']['input']>;
  remainingNEQ?: InputMaybe<Scalars['u8']['input']>;
};

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Player = {
  __typename?: 'Player';
  entity?: Maybe<World__Entity>;
  gameId?: Maybe<Scalars['felt252']['output']>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  edges?: Maybe<Array<Maybe<PlayerEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PlayerEdge = {
  __typename?: 'PlayerEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Player>;
};

export type PlayerOrder = {
  direction: OrderDirection;
  field: PlayerOrderField;
};

export enum PlayerOrderField {
  Gameid = 'GAMEID',
  Player = 'PLAYER'
}

export type PlayerWhereInput = {
  gameId?: InputMaybe<Scalars['felt252']['input']>;
  gameIdEQ?: InputMaybe<Scalars['felt252']['input']>;
  gameIdGT?: InputMaybe<Scalars['felt252']['input']>;
  gameIdGTE?: InputMaybe<Scalars['felt252']['input']>;
  gameIdLT?: InputMaybe<Scalars['felt252']['input']>;
  gameIdLTE?: InputMaybe<Scalars['felt252']['input']>;
  gameIdNEQ?: InputMaybe<Scalars['felt252']['input']>;
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
};

export type Position = {
  __typename?: 'Position';
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['felt252']['output']>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  vec?: Maybe<Position_Vec2>;
};

export type PositionConnection = {
  __typename?: 'PositionConnection';
  edges?: Maybe<Array<Maybe<PositionEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type PositionEdge = {
  __typename?: 'PositionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Position>;
};

export type PositionOrder = {
  direction: OrderDirection;
  field: PositionOrderField;
};

export enum PositionOrderField {
  GameId = 'GAME_ID',
  Player = 'PLAYER',
  Vec = 'VEC'
}

export type PositionWhereInput = {
  game_id?: InputMaybe<Scalars['felt252']['input']>;
  game_idEQ?: InputMaybe<Scalars['felt252']['input']>;
  game_idGT?: InputMaybe<Scalars['felt252']['input']>;
  game_idGTE?: InputMaybe<Scalars['felt252']['input']>;
  game_idLT?: InputMaybe<Scalars['felt252']['input']>;
  game_idLTE?: InputMaybe<Scalars['felt252']['input']>;
  game_idNEQ?: InputMaybe<Scalars['felt252']['input']>;
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
};

export type Position_Vec2 = {
  __typename?: 'Position_Vec2';
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type Range = {
  __typename?: 'Range';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['u32']['output']>;
};

export type RangeConnection = {
  __typename?: 'RangeConnection';
  edges?: Maybe<Array<Maybe<RangeEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type RangeEdge = {
  __typename?: 'RangeEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Range>;
};

export type RangeOrder = {
  direction: OrderDirection;
  field: RangeOrderField;
};

export enum RangeOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type RangeWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['u32']['input']>;
  valueEQ?: InputMaybe<Scalars['u32']['input']>;
  valueGT?: InputMaybe<Scalars['u32']['input']>;
  valueGTE?: InputMaybe<Scalars['u32']['input']>;
  valueLT?: InputMaybe<Scalars['u32']['input']>;
  valueLTE?: InputMaybe<Scalars['u32']['input']>;
  valueNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type Square = {
  __typename?: 'Square';
  entity?: Maybe<World__Entity>;
  game_id?: Maybe<Scalars['felt252']['output']>;
  piece?: Maybe<Scalars['Enum']['output']>;
  vec?: Maybe<Square_Vec2>;
};

export type SquareConnection = {
  __typename?: 'SquareConnection';
  edges?: Maybe<Array<Maybe<SquareEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type SquareEdge = {
  __typename?: 'SquareEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Square>;
};

export type SquareOrder = {
  direction: OrderDirection;
  field: SquareOrderField;
};

export enum SquareOrderField {
  GameId = 'GAME_ID',
  Piece = 'PIECE',
  Vec = 'VEC'
}

export type SquareWhereInput = {
  game_id?: InputMaybe<Scalars['felt252']['input']>;
  game_idEQ?: InputMaybe<Scalars['felt252']['input']>;
  game_idGT?: InputMaybe<Scalars['felt252']['input']>;
  game_idGTE?: InputMaybe<Scalars['felt252']['input']>;
  game_idLT?: InputMaybe<Scalars['felt252']['input']>;
  game_idLTE?: InputMaybe<Scalars['felt252']['input']>;
  game_idNEQ?: InputMaybe<Scalars['felt252']['input']>;
  piece?: InputMaybe<Scalars['Enum']['input']>;
};

export type Square_Vec2 = {
  __typename?: 'Square_Vec2';
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type Username = {
  __typename?: 'Username';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['felt252']['output']>;
};

export type UsernameConnection = {
  __typename?: 'UsernameConnection';
  edges?: Maybe<Array<Maybe<UsernameEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type UsernameEdge = {
  __typename?: 'UsernameEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Username>;
};

export type UsernameOrder = {
  direction: OrderDirection;
  field: UsernameOrderField;
};

export enum UsernameOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type UsernameWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['felt252']['input']>;
  valueEQ?: InputMaybe<Scalars['felt252']['input']>;
  valueGT?: InputMaybe<Scalars['felt252']['input']>;
  valueGTE?: InputMaybe<Scalars['felt252']['input']>;
  valueLT?: InputMaybe<Scalars['felt252']['input']>;
  valueLTE?: InputMaybe<Scalars['felt252']['input']>;
  valueNEQ?: InputMaybe<Scalars['felt252']['input']>;
};

export type VotingPoint = {
  __typename?: 'VotingPoint';
  entity?: Maybe<World__Entity>;
  player?: Maybe<Scalars['ContractAddress']['output']>;
  value?: Maybe<Scalars['u8']['output']>;
};

export type VotingPointConnection = {
  __typename?: 'VotingPointConnection';
  edges?: Maybe<Array<Maybe<VotingPointEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type VotingPointEdge = {
  __typename?: 'VotingPointEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<VotingPoint>;
};

export type VotingPointOrder = {
  direction: OrderDirection;
  field: VotingPointOrderField;
};

export enum VotingPointOrderField {
  Player = 'PLAYER',
  Value = 'VALUE'
}

export type VotingPointWhereInput = {
  player?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  playerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  value?: InputMaybe<Scalars['u8']['input']>;
  valueEQ?: InputMaybe<Scalars['u8']['input']>;
  valueGT?: InputMaybe<Scalars['u8']['input']>;
  valueGTE?: InputMaybe<Scalars['u8']['input']>;
  valueLT?: InputMaybe<Scalars['u8']['input']>;
  valueLTE?: InputMaybe<Scalars['u8']['input']>;
  valueNEQ?: InputMaybe<Scalars['u8']['input']>;
};

export type World__Content = {
  __typename?: 'World__Content';
  coverUri?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  iconUri?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  socials?: Maybe<Array<Maybe<World__Social>>>;
  website?: Maybe<Scalars['String']['output']>;
};

export type World__Entity = {
  __typename?: 'World__Entity';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  eventId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type World__EntityConnection = {
  __typename?: 'World__EntityConnection';
  edges?: Maybe<Array<Maybe<World__EntityEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type World__EntityEdge = {
  __typename?: 'World__EntityEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Entity>;
};

export type World__Event = {
  __typename?: 'World__Event';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type World__EventConnection = {
  __typename?: 'World__EventConnection';
  edges?: Maybe<Array<Maybe<World__EventEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type World__EventEdge = {
  __typename?: 'World__EventEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Event>;
};

export type World__Metadata = {
  __typename?: 'World__Metadata';
  content?: Maybe<World__Content>;
  coverImg?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  iconImg?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  uri?: Maybe<Scalars['String']['output']>;
  worldAddress: Scalars['String']['output'];
};

export type World__MetadataConnection = {
  __typename?: 'World__MetadataConnection';
  edges?: Maybe<Array<Maybe<World__MetadataEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type World__MetadataEdge = {
  __typename?: 'World__MetadataEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Metadata>;
};

export type World__Model = {
  __typename?: 'World__Model';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type World__ModelConnection = {
  __typename?: 'World__ModelConnection';
  edges?: Maybe<Array<Maybe<World__ModelEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type World__ModelEdge = {
  __typename?: 'World__ModelEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Model>;
};

export type World__PageInfo = {
  __typename?: 'World__PageInfo';
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  hasNextPage?: Maybe<Scalars['Boolean']['output']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']['output']>;
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type World__Query = {
  __typename?: 'World__Query';
  actionpointModels?: Maybe<ActionPointConnection>;
  aliveModels?: Maybe<AliveConnection>;
  claimintervalModels?: Maybe<ClaimIntervalConnection>;
  entities?: Maybe<World__EntityConnection>;
  entity: World__Entity;
  events?: Maybe<World__EventConnection>;
  gamesessionModels?: Maybe<GameSessionConnection>;
  healthModels?: Maybe<HealthConnection>;
  ingameModels?: Maybe<InGameConnection>;
  lastactionpointclaimModels?: Maybe<LastActionPointClaimConnection>;
  lastvotingpointclaimModels?: Maybe<LastVotingPointClaimConnection>;
  metadatas?: Maybe<World__MetadataConnection>;
  model: World__Model;
  models?: Maybe<World__ModelConnection>;
  movesModels?: Maybe<MovesConnection>;
  playerModels?: Maybe<PlayerConnection>;
  positionModels?: Maybe<PositionConnection>;
  rangeModels?: Maybe<RangeConnection>;
  squareModels?: Maybe<SquareConnection>;
  transaction: World__Transaction;
  transactions?: Maybe<World__TransactionConnection>;
  usernameModels?: Maybe<UsernameConnection>;
  votingpointModels?: Maybe<VotingPointConnection>;
};


export type World__QueryActionpointModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ActionPointOrder>;
  where?: InputMaybe<ActionPointWhereInput>;
};


export type World__QueryAliveModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<AliveOrder>;
  where?: InputMaybe<AliveWhereInput>;
};


export type World__QueryClaimintervalModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ClaimIntervalOrder>;
  where?: InputMaybe<ClaimIntervalWhereInput>;
};


export type World__QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type World__QueryEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryGamesessionModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameSessionOrder>;
  where?: InputMaybe<GameSessionWhereInput>;
};


export type World__QueryHealthModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<HealthOrder>;
  where?: InputMaybe<HealthWhereInput>;
};


export type World__QueryIngameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<InGameOrder>;
  where?: InputMaybe<InGameWhereInput>;
};


export type World__QueryLastactionpointclaimModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<LastActionPointClaimOrder>;
  where?: InputMaybe<LastActionPointClaimWhereInput>;
};


export type World__QueryLastvotingpointclaimModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<LastVotingPointClaimOrder>;
  where?: InputMaybe<LastVotingPointClaimWhereInput>;
};


export type World__QueryMetadatasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryModelArgs = {
  id: Scalars['ID']['input'];
};


export type World__QueryModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryMovesModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<MovesOrder>;
  where?: InputMaybe<MovesWhereInput>;
};


export type World__QueryPlayerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PlayerOrder>;
  where?: InputMaybe<PlayerWhereInput>;
};


export type World__QueryPositionModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PositionOrder>;
  where?: InputMaybe<PositionWhereInput>;
};


export type World__QueryRangeModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RangeOrder>;
  where?: InputMaybe<RangeWhereInput>;
};


export type World__QuerySquareModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<SquareOrder>;
  where?: InputMaybe<SquareWhereInput>;
};


export type World__QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type World__QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type World__QueryUsernameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<UsernameOrder>;
  where?: InputMaybe<UsernameWhereInput>;
};


export type World__QueryVotingpointModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<VotingPointOrder>;
  where?: InputMaybe<VotingPointWhereInput>;
};

export type World__Social = {
  __typename?: 'World__Social';
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type World__Subscription = {
  __typename?: 'World__Subscription';
  entityUpdated: World__Entity;
  eventEmitted: World__Event;
  modelRegistered: World__Model;
};


export type World__SubscriptionEntityUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type World__SubscriptionEventEmittedArgs = {
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type World__SubscriptionModelRegisteredArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type World__Transaction = {
  __typename?: 'World__Transaction';
  calldata?: Maybe<Array<Maybe<Scalars['felt252']['output']>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  maxFee?: Maybe<Scalars['felt252']['output']>;
  nonce?: Maybe<Scalars['felt252']['output']>;
  senderAddress?: Maybe<Scalars['felt252']['output']>;
  signature?: Maybe<Array<Maybe<Scalars['felt252']['output']>>>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type World__TransactionConnection = {
  __typename?: 'World__TransactionConnection';
  edges?: Maybe<Array<Maybe<World__TransactionEdge>>>;
  pageInfo: World__PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type World__TransactionEdge = {
  __typename?: 'World__TransactionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<World__Transaction>;
};

export type EventsSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type EventsSubscriptionSubscription = { __typename?: 'World__Subscription', eventEmitted: { __typename?: 'World__Event', id?: string | null, keys?: Array<string | null> | null, data?: Array<string | null> | null } };



export const EventsSubscriptionDocument = `
    subscription EventsSubscription {
  eventEmitted {
    id
    keys
    data
  }
}
    `;