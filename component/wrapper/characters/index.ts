import _qiuqiu from './qiuqiu.png';
import _taotao from './taotao.png';
import _qiuqiu2 from './qiuqiu2.png';
import _qiuqiu3 from './qiuqiu3.png';

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
  image: _qiuqiu,
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
  image: _taotao,
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
  image: _qiuqiu2,
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
  image: _qiuqiu3,
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
