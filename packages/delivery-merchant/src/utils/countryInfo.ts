import { t } from 'utils/i18nextFix'

export const getCountryInfo = () => {
  // const countries = [{ label: "Libya", value: "Libya" }];
  // const cities = [
  //   { label: t("Tripoli"), value: "Tripoli" },
  //   { label: t("Ajdabiya"), value: 'Ajdabiya' },
  //   { label: t("Zuwara"), value: "Zuwara" },
  //   { label: t("Yafran"), value: "Yafran" },
  //   { label: t("Nalut"), value: "Nalut" },
  //   { label: t("Gharyan"), value: "Gharyan" },
  //   { label: t("Al_Bayda"), value: "Al Bayda" },
  //   { label: t("Bani_Walid"), value: "Bani Walid" },
  //   { label: t("Al_Marj"), value: "Al Marj" },
  //   { label: t("Mizda"), value: "Mizda" },
  //   { label: t("Benghazi"), value: "Benghazi" },
  //   { label: t("Awbari"), value: "Awbari" },
  //   { label: t("Tobruk"), value: "Tobruk" },
  //   { label: t("Al_Khums"), value: "Al Khums" },
  //   { label: t("Murzuk"), value: "Murzuk" },
  //   { label: t("Shahat"), value: "Shahat" },
  //   { label: t("Sabratah"), value: "Sabratah" },
  //   { label: t("Ghat"), value: "Ghat" },
  //   { label: t("Sirte"), value: "Sirte" },
  //   { label: t("Tajura"), value: "Tajura" },
  //   { label: t("Misrata"), value: "Misrata" },
  //   { label: t("Zawiya"), value: "Zawiya" },
  //   { label: t("Sabha"), value: "Sabha" },
  //   { label: t("Brak"), value: "Brak" },
  //   { label: t("Ghadamis"), value: "Ghadamis" },
  //   { label: t("Al_Abyar"), value: "Al Abyar" },
  //   { label: t("Tarhunah"), value: "Tarhunah" },
  //   { label: t("Derna"), value: "Derna" },
  //   { label: t("Waddan"), value: "Waddan" },
  //   { label: t("Awjila"), value: "Awjila" },
  //   { label: t("Suluq"), value: "Suluq" },
  //   { label: t("Zelten"), value: "Zelten" },
  //   { label: t("Qatrun"), value: "Qatrun" },
  //   { label: t("Al_Qubbah"), value: "Al Qubbah" },
  //   { label: t("Tocra"), value: "Tocra" },
  //   { label: t("Jalu"), value: "Jalu" },
  //   { label: t("Zliten"), value: "Zliten" },
  //   { label: t("Al_Jamīl"), value: "Al Jamīl" },
  //   { label: t("Brega"), value: "Brega" },
  //   { label: t("Farzougha"), value: "Farzougha" },
  //   { label: t("Sorman"), value: "Sorman" },
  //   { label: t("Msallata"), value: "Msallata" },
  //   { label: t("Kikla"), value: "Kikla" },
  // ];

  const countries = [{ label: 'Libya', value: 'Libya' }]
  const cities = {
    Libya: [
      { label: t('Tripoli'), value: 'Tripoli' },
      { label: t('Ajdabiya'), value: 'Ajdabiya' },
      { label: t('Zuwara'), value: 'Zuwara' },
      { label: t('Yafran'), value: 'Yafran' },
      { label: t('Nalut'), value: 'Nalut' },
      { label: t('Gharyan'), value: 'Gharyan' },
      { label: t('Al_Bayda'), value: 'Al Bayda' },
      { label: t('Bani_Walid'), value: 'Bani Walid' },
      { label: t('Al_Marj'), value: 'Al Marj' },
      { label: t('Mizda'), value: 'Mizda' },
      { label: t('Benghazi'), value: 'Benghazi' },
      { label: t('Awbari'), value: 'Awbari' },
      { label: t('Tobruk'), value: 'Tobruk' },
      { label: t('Al_Khums'), value: 'Al Khums' },
      { label: t('Murzuk'), value: 'Murzuk' },
      { label: t('Shahat'), value: 'Shahat' },
      { label: t('Sabratah'), value: 'Sabratah' },
      { label: t('Ghat'), value: 'Ghat' },
      { label: t('Sirte'), value: 'Sirte' },
      { label: t('Tajura'), value: 'Tajura' },
      { label: t('Misrata'), value: 'Misrata' },
      { label: t('Zawiya'), value: 'Zawiya' },
      { label: t('Sabha'), value: 'Sabha' },
      { label: t('Brak'), value: 'Brak' },
      { label: t('Ghadamis'), value: 'Ghadamis' },
      { label: t('Al_Abyar'), value: 'Al Abyar' },
      { label: t('Tarhunah'), value: 'Tarhunah' },
      { label: t('Derna'), value: 'Derna' },
      { label: t('Waddan'), value: 'Waddan' },
      { label: t('Awjila'), value: 'Awjila' },
      { label: t('Suluq'), value: 'Suluq' },
      { label: t('Zelten'), value: 'Zelten' },
      { label: t('Qatrun'), value: 'Qatrun' },
      { label: t('Al_Qubbah'), value: 'Al Qubbah' },
      { label: t('Tocra'), value: 'Tocra' },
      { label: t('Jalu'), value: 'Jalu' },
      { label: t('Zliten'), value: 'Zliten' },
      { label: t('Al_Jamīl'), value: 'Al Jamīl' },
      { label: t('Brega'), value: 'Brega' },
      { label: t('Farzougha'), value: 'Farzougha' },
      { label: t('Sorman'), value: 'Sorman' },
      { label: t('Msallata'), value: 'Msallata' },
      { label: t('Kikla'), value: 'Kikla' },
    ],
  }

  return { countries, cities }
}
