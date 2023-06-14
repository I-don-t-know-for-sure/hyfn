import { t } from "i18next";
import { toObject } from "./constants";

export const currencies = { Libya: "LYD" };
export const currenciesArray = ["LYD"] as const;

export const countriesArray = ["Libya"] as const;
export const citiesArray = [
  "Tripoli",
  "Ajdabiya",
  "Zuwara",
  "Yafran",
  "Nalut",
  "Gharyan",
  "Al Bayda",
  "Bani Walid",
  "Al-Marj",
  "Mizda",
  "Benghazi",
  "Awbari",
  "Tobruk",
  "Al-Khums",
  "Murzuk",
  "Shahat",
  "Sabratah",
  "Ghat",
  "Sirte",
  "Tajura",
  "Misrata",
  "Zawiya",
  "Sabha",
  "Brak",
  "Ghadamis",
  "Al Abyar",
  "Tarhunah",
  "Derna",
  "Waddan",
  "Awjila",
  "Suluq",
  "Zelten",
  "Qatrun",
  "Al Qubbah",
  "Tocra",
  "Jalu",
  "Zliten",
  "Al Jamīl",
  "Brega",
  "Farzougha",
  "Sorman",
  "Msallata",
  "Kikla"
] as const;
export const countries = toObject(countriesArray);
export const cities = toObject(citiesArray);
export const countriesForSelect = countriesArray.map((value) => {
  return { label: value, value };
});
export const citiesForSelect = citiesArray.map((value) => {
  return { label: value, value };
});

export const allCitiesForSelect = {
  [countries.Libya]: citiesForSelect
};

allCitiesForSelect["Libya"];
// export const countries = {
//   Libya: "Libya",
// };

// export const cities = {
//   Libya: {
//     Tripoli: "Tripoli",
//     Ajdabiya: "Ajdabiya",
//     Zuwara: "Zuwara",
//     Yafran: "Yafran",
//     Nalut: "Nalut",
//     Gharyan: "Gharyan",
//     "Al Bayda": "Al Bayda",
//     "Bani Walid": "Bani Walid",
//     "Al-Marj": "Al-Marj",
//     Mizda: "Mizda",
//     Benghazi: "Benghazi",
//     Awbari: "Awbari",
//     Tobruk: "Tobruk",
//     "Al-Khums": "Al-Khums",
//     Murzuk: "Murzuk",
//     Shahat: "Shahat",
//     Sabratah: "Sabratah",
//     Ghat: "Ghat",
//     Sirte: "Sirte",
//     Tajura: "Tajura",
//     Misrata: "Misrata",
//     Zawiya: "Zawiya",
//     Sabha: "Sabha",
//     Brak: "Brak",
//     Ghadamis: "Ghadamis",
//     "Al Abyar": "Al Abyar",
//     Tarhunah: "Tarhunah",
//     Derna: "Derna",
//     Waddan: "Waddan",
//     Awjila: "Awjila",
//     Suluq: "Suluq",
//     Zelten: "Zelten",
//     Qatrun: "Qatrun",
//     "Al Qubbah": "Al Qubbah",
//     Tocra: "Tocra",
//     Jalu: "Jalu",
//     Zliten: "Zliten",
//     "Al Jamīl": "Al Jamīl",
//     Brega: "Brega",
//     Farzougha: "Farzougha",
//     Sorman: "Sorman",
//     Msallata: "Msallata",
//     Kikla: "Kikla",
//   },
// };
