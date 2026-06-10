export interface SakanaWidgetState {
  i: number;
  s: number;
  d: number;
  r: number;
  y: number;
  t: number;
  w: number;
}

export interface SakanaWidgetCharacter {
  image: string;
  initialState: SakanaWidgetState;
}

const qiuqiu: SakanaWidgetCharacter = {
  image: 'https://www.img520.com/s941MX.png',
  initialState: {
    i: 0.08,
    s: 0.1,
    d: 0.99,
    r: 1,
    y: 40,
    t: 0,
    w: 0,
  },
};

const taotao: SakanaWidgetCharacter = {
  image: 'https://www.img520.com/5Ept37.png',
  initialState: {
    i: 0.07,
    s: 0.12,
    d: 0.99,
    r: 8,
    y: 20,
    t: 0,
    w: 0,
  },
};

const qiuqiu2: SakanaWidgetCharacter = {
  image: 'https://www.img520.com/vjr47i.png',
  initialState: {
    i: 0.09,
    s: 0.08,
    d: 0.988,
    r: -5,
    y: 30,
    t: 0,
    w: 0,
  },
};

const qiuqiu3: SakanaWidgetCharacter = {
  image: 'https://www.img520.com/z8EN7C.png',
  initialState: {
    i: 0.08,
    s: 0.1,
    d: 0.99,
    r: 3,
    y: -10,
    t: 0,
    w: 0,
  },
};

export default {
  qiuqiu,
  taotao,
  qiuqiu2,
  qiuqiu3,
};
