export interface Game {
  id?: number;

  player_turn?: any;

  owner?: any;
  opponent?: any;

  owner_mana?: number;
  opponent_mana?: number;

  owner_deck?: any;
  opponent_deck?: any;

  owner_deck_cards?: any[];
  opponent_deck_cards?: any[];

  owner_hand_cards?: any[];
  opponent_hand_cards?: any[];

  owner_board_cards?: any[];
  opponent_board_cards?: any[];

  owner_graveyard_cards?: any[];
  opponent_graveyard_cards?: any[];
}
