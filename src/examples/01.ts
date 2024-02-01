export const fruitCounts = {
  apple: 1,
  pear: 4,
  banana: 26,
};

type SingleFruitCount =
  | { apple: number }
  | { banana: number }
  | { pear: number };

const singleFruitCount: SingleFruitCount = {
  banana: 12,
};

type FruitCounts = typeof fruitCounts;

type NewSingleFruitCount = {
  [K in keyof FruitCounts]: {
    [K2 in K]: number;
  };
}[keyof FruitCounts];

const singleFruitCount2: NewSingleFruitCount = {
  pear: 4,
  apple: 1,
  banana: 26,
};
