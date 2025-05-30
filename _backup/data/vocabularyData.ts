import { VocabItem, WeekData } from '../types';

// 1주차 데이터
const week1Data: WeekData = {
  "week": 1,
  "totalWords": 90,
  "words": [
    {
      "id": 1,
      "kanji": "幼い",
      "korean": "어리다, 미숙하다",
      "hiragana": "おさない"
    },
    {
      "id": 2,
      "kanji": "絞る",
      "korean": "쥐어짜다",
      "hiragana": "しぼる"
    },
    {
      "id": 3,
      "kanji": "抱える",
      "korean": "(껴)안다",
      "hiragana": "かかえる"
    },
    {
      "id": 4,
      "kanji": "求人",
      "korean": "구인",
      "hiragana": "きゅうじん"
    },
    {
      "id": 5,
      "kanji": "柔軟",
      "korean": "유연함",
      "hiragana": "じゅうなん"
    },
    {
      "id": 6,
      "kanji": "垂直",
      "korean": "수직",
      "hiragana": "すいちょく"
    },
    {
      "id": 7,
      "kanji": "強火",
      "korean": "강한 불",
      "hiragana": "つよび"
    },
    {
      "id": 8,
      "kanji": "握る",
      "korean": "쥐다",
      "hiragana": "にぎる"
    },
    {
      "id": 9,
      "kanji": "乱れる",
      "korean": "흐트러지다, 문란해지다",
      "hiragana": "みだれる"
    },
    {
      "id": 10,
      "kanji": "密閉",
      "korean": "밀폐",
      "hiragana": "みっぺい"
    },
    {
      "id": 11,
      "kanji": "怪しい",
      "korean": "수상하다",
      "hiragana": "あやしい"
    },
    {
      "id": 12,
      "kanji": "納める",
      "korean": "납부하다, 바치다",
      "hiragana": "おさめる"
    },
    {
      "id": 13,
      "kanji": "劣る",
      "korean": "못하다, 뒤떨어지다",
      "hiragana": "おとる"
    },
    {
      "id": 14,
      "kanji": "願望",
      "korean": "원망",
      "hiragana": "がんぼう"
    },
    {
      "id": 15,
      "kanji": "競う",
      "korean": "다투다",
      "hiragana": "きそう"
    },
    {
      "id": 16,
      "kanji": "貴重",
      "korean": "귀중",
      "hiragana": "きちょう"
    },
    {
      "id": 17,
      "kanji": "治療",
      "korean": "치료",
      "hiragana": "ちりょう"
    },
    {
      "id": 18,
      "kanji": "伴う",
      "korean": "동반하다",
      "hiragana": "ともなう"
    },
    {
      "id": 19,
      "kanji": "批評",
      "korean": "비평",
      "hiragana": "ひひょう"
    },
    {
      "id": 20,
      "kanji": "容姿",
      "korean": "용자(외모)",
      "hiragana": "ようし"
    },
    {
      "id": 21,
      "kanji": "囲む",
      "korean": "둘러싸다",
      "hiragana": "かこむ"
    },
    {
      "id": 22,
      "kanji": "行事",
      "korean": "행사",
      "hiragana": "ぎょうじ"
    },
    {
      "id": 23,
      "kanji": "拒否",
      "korean": "거부",
      "hiragana": "きょひ"
    },
    {
      "id": 24,
      "kanji": "現象",
      "korean": "현상",
      "hiragana": "げんしょう"
    },
    {
      "id": 25,
      "kanji": "省略",
      "korean": "생략",
      "hiragana": "しょうりゃく"
    },
    {
      "id": 26,
      "kanji": "尊重",
      "korean": "존중",
      "hiragana": "そんちょう"
    },
    {
      "id": 27,
      "kanji": "触れる",
      "korean": "접촉하다, 닿다",
      "hiragana": "ふれる"
    },
    {
      "id": 28,
      "kanji": "移転",
      "korean": "이전",
      "hiragana": "いてん"
    },
    {
      "id": 29,
      "kanji": "以内",
      "korean": "이내",
      "hiragana": "いない"
    },
    {
      "id": 30,
      "kanji": "植木",
      "korean": "정원수",
      "hiragana": "うえき"
    },
    {
      "id": 31,
      "kanji": "損害",
      "korean": "손해",
      "hiragana": "そんがい"
    },
    {
      "id": 32,
      "kanji": "乏しい",
      "korean": "모자라다, 부족하다",
      "hiragana": "とぼしい"
    },
    {
      "id": 33,
      "kanji": "憎い",
      "korean": "밉다",
      "hiragana": "にくい"
    },
    {
      "id": 34,
      "kanji": "含める",
      "korean": "포함시키다",
      "hiragana": "ふくめる"
    },
    {
      "id": 35,
      "kanji": "油断",
      "korean": "방심",
      "hiragana": "ゆだん"
    },
    {
      "id": 36,
      "kanji": "圧勝",
      "korean": "압승",
      "hiragana": "あっしょう"
    },
    {
      "id": 37,
      "kanji": "傷む",
      "korean": "아프다",
      "hiragana": "いたむ"
    },
    {
      "id": 38,
      "kanji": "大幅に",
      "korean": "크게, 대폭적으로",
      "hiragana": "おおはばに"
    },
    {
      "id": 39,
      "kanji": "極端に",
      "korean": "극단적으로",
      "hiragana": "きょくたんに"
    },
    {
      "id": 40,
      "kanji": "悔しい",
      "korean": "분하다",
      "hiragana": "くやしい"
    },
    {
      "id": 41,
      "kanji": "継続",
      "korean": "계속",
      "hiragana": "けいぞく"
    },
    {
      "id": 42,
      "kanji": "除く",
      "korean": "제거하다",
      "hiragana": "のぞく"
    },
    {
      "id": 43,
      "kanji": "貿易",
      "korean": "무역",
      "hiragana": "ぼうえき"
    },
    {
      "id": 44,
      "kanji": "戻す",
      "korean": "되돌리다",
      "hiragana": "もどす"
    },
    {
      "id": 45,
      "kanji": "幼稚だ",
      "korean": "유치하다",
      "hiragana": "ようちだ"
    },
    {
      "id": 46,
      "kanji": "改めて",
      "korean": "새삼스럽게",
      "hiragana": "あらためて"
    },
    {
      "id": 47,
      "kanji": "拡充",
      "korean": "확충",
      "hiragana": "かくじゅう"
    },
    {
      "id": 48,
      "kanji": "隠す",
      "korean": "숨기다, 감추다",
      "hiragana": "かくす"
    },
    {
      "id": 49,
      "kanji": "勧誘",
      "korean": "권유",
      "hiragana": "かんゆう"
    },
    {
      "id": 50,
      "kanji": "姿勢",
      "korean": "자세",
      "hiragana": "しせい"
    },
    {
      "id": 51,
      "kanji": "清潔だ",
      "korean": "청결하다",
      "hiragana": "せいけつだ"
    },
    {
      "id": 52,
      "kanji": "積む",
      "korean": "쌓다",
      "hiragana": "つむ"
    },
    {
      "id": 53,
      "kanji": "逃亡",
      "korean": "도망",
      "hiragana": "とうぼう"
    },
    {
      "id": 54,
      "kanji": "模範",
      "korean": "모범",
      "hiragana": "もはん"
    },
    {
      "id": 55,
      "kanji": "世の中",
      "korean": "세상",
      "hiragana": "よのなか"
    },
    {
      "id": 56,
      "kanji": "治す",
      "korean": "고치다, 치료하다",
      "hiragana": "なおす"
    },
    {
      "id": 57,
      "kanji": "防災",
      "korean": "방재",
      "hiragana": "ぼうさい"
    },
    {
      "id": 58,
      "kanji": "一方",
      "korean": "일방",
      "hiragana": "いっぽう"
    },
    {
      "id": 59,
      "kanji": "違反",
      "korean": "위반",
      "hiragana": "いはん"
    },
    {
      "id": 60,
      "kanji": "飲酒",
      "korean": "음주",
      "hiragana": "いんしゅ"
    },
    {
      "id": 61,
      "kanji": "削除",
      "korean": "삭제",
      "hiragana": "さくじょ"
    },
    {
      "id": 62,
      "kanji": "撮影",
      "korean": "촬영",
      "hiragana": "さつえい"
    },
    {
      "id": 63,
      "kanji": "占める",
      "korean": "차지하다",
      "hiragana": "しめる"
    },
    {
      "id": 64,
      "kanji": "焦点",
      "korean": "초점",
      "hiragana": "しょうてん"
    },
    {
      "id": 65,
      "kanji": "装置",
      "korean": "장치",
      "hiragana": "そうち"
    },
    {
      "id": 66,
      "kanji": "抽象的",
      "korean": "추상적",
      "hiragana": "ちゅうしょうてき"
    },
    {
      "id": 67,
      "kanji": "破片",
      "korean": "파편",
      "hiragana": "はへん"
    },
    {
      "id": 68,
      "kanji": "針",
      "korean": "바늘",
      "hiragana": "はり"
    },
    {
      "id": 69,
      "kanji": "返却",
      "korean": "반납",
      "hiragana": "へんきゃく"
    },
    {
      "id": 70,
      "kanji": "略する",
      "korean": "생략하다",
      "hiragana": "りゃくする"
    },
    {
      "id": 71,
      "kanji": "祝う",
      "korean": "축하하다",
      "hiragana": "いわう"
    },
    {
      "id": 72,
      "kanji": "補う",
      "korean": "보충하다, 보완하다",
      "hiragana": "おぎなう"
    },
    {
      "id": 73,
      "kanji": "至急",
      "korean": "지급, (매우 급하다)",
      "hiragana": "しきゅう"
    },
    {
      "id": 74,
      "kanji": "地元",
      "korean": "고향, 고장(살아온 곳)",
      "hiragana": "じもと"
    },
    {
      "id": 75,
      "kanji": "率直だ",
      "korean": "솔직하다",
      "hiragana": "そっちょくだ"
    },
    {
      "id": 76,
      "kanji": "調節",
      "korean": "조절",
      "hiragana": "ちょうせつ"
    },
    {
      "id": 77,
      "kanji": "豊富だ",
      "korean": "풍부하다",
      "hiragana": "ほうふだ"
    },
    {
      "id": 78,
      "kanji": "密接だ",
      "korean": "밀접하다",
      "hiragana": "みっせつだ"
    },
    {
      "id": 79,
      "kanji": "敗れる",
      "korean": "지다, 패배하다",
      "hiragana": "やぶれる"
    },
    {
      "id": 80,
      "kanji": "要求",
      "korean": "요구",
      "hiragana": "ようきゅう"
    },
    {
      "id": 81,
      "kanji": "辛い",
      "korean": "맵다, 고통스럽다",
      "hiragana": "からい、つらい"
    },
    {
      "id": 82,
      "kanji": "規模",
      "korean": "규모",
      "hiragana": "きぼ"
    },
    {
      "id": 83,
      "kanji": "景色",
      "korean": "경치",
      "hiragana": "けしき"
    },
    {
      "id": 84,
      "kanji": "相互",
      "korean": "상호",
      "hiragana": "そうご"
    },
    {
      "id": 85,
      "kanji": "備える",
      "korean": "준비하다, 갖추다",
      "hiragana": "そなえる"
    },
    {
      "id": 86,
      "kanji": "隣",
      "korean": "이웃",
      "hiragana": "となり"
    },
    {
      "id": 87,
      "kanji": "汗",
      "korean": "땀",
      "hiragana": "あせ"
    },
    {
      "id": 88,
      "kanji": "誤り",
      "korean": "잘못, 실수",
      "hiragana": "あやまり"
    },
    {
      "id": 89,
      "kanji": "医療",
      "korean": "의료",
      "hiragana": "いりょう"
    },
    {
      "id": 90,
      "kanji": "印刷",
      "korean": "인쇄",
      "hiragana": "いんさつ"
    }
  ]
};

export default week1Data;