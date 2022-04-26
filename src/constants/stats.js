import { RgbToRgba, getDateRangeByType } from '../utils';

export const DEFAULT_STATS_FILTER = {
  day: {
    range: getDateRangeByType('month'),
  },
  week: {
    range: getDateRangeByType('month'),
  },
  month: {
    range: getDateRangeByType('year'),
  },
};

export const COLORS = {
  blue: 'rgb(54, 162, 235)',
  green: 'rgb(75, 192, 192)',
  orange: 'rgb(255, 159, 64)',
  purple: 'rgb(153, 102, 255)',
  red: 'rgb(255, 99, 132)',
  yellow: 'rgb(255, 205, 86)',
  grey: 'rgb(201, 203, 207)',
};

export const CHART_OPTIONS = {
  scales: {
    yAxes: [
      {
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
        },
      },
    ],
  },
  responsive: true,
  pointHitDetectionRadius: 3,
};

export const CHART_LABEL_OPTIONS = {
  backgroundColor: RgbToRgba(COLORS.blue, '.5'),
  borderColor: COLORS.blue,
  borderWidth: 1,
};

export const USER_GRADE = {
  'zh-CN': [{ value: '1', name: '一级用户' }, { value: '2', name: '二级用户' }, { value: '3', name: '三级用户' }],
  'en-US': [{ value: '1', name: 'Primary User' }, { value: '2', name: 'Secondary User' }, { value: '3', name: 'Tertiary User' }],
};

export const EVENT_TYPE = {
  'zh-CN': { 1: '结果上报' },
  'en-US': { 1: 'Events Report' },
};

// 人体特征
export function PERSON_FEATURE(locale = 'zh-CN') {
  return (
    [
      {
        name: locale === 'zh-CN' ? '性别' : 'Gender',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '男' : 'Male', value: 'male' },
          { name: locale === 'zh-CN' ? '女' : 'Female', value: 'female' }],
        key: 'sex',
      },
      {
        name: locale === 'zh-CN' ? '年龄' : 'Age',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '儿童' : 'Children', value: 'child' },
          { name: locale === 'zh-CN' ? '青年' : 'Youth', value: 'youth' },
          { name: locale === 'zh-CN' ? '中年' : 'Middle Age', value: 'middle age' },
          { name: locale === 'zh-CN' ? '老年' : 'Agedness', value: 'old age' },
          { name: locale === 'zh-CN' ? '少年' : 'Juvenile', value: 'teenager' }],
        key: 'age',
      },
      {
        name: locale === 'zh-CN' ? '朝向' : 'Orientation',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '前' : 'Front', value: 'front' },
          { name: locale === 'zh-CN' ? '后' : 'Back', value: 'back' },
          { name: locale === 'zh-CN' ? '侧' : 'Side', value: 'side' },
          { name: locale === 'zh-CN' ? '左' : 'Left', value: 'left' },
          { name: locale === 'zh-CN' ? '右' : 'Right', value: 'right' }],
        key: 'orientation',
      },
      {
        name: locale === 'zh-CN' ? '打伞' : 'Umbrella',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '未打伞' : 'Without Umbrella', value: 'no umbrella' },
          { name: locale === 'zh-CN' ? '打伞' : 'Holding an Umbrella', value: 'holding an umbrella' }],
        key: 'umbrella',
      },
      {
        name: locale === 'zh-CN' ? '发型' : 'Hairstyle',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '长发' : 'Long Hair', value: 'long hair' },
          { name: locale === 'zh-CN' ? '短发' : 'Short Hair', value: 'short hair' },
          { name: locale === 'zh-CN' ? '马尾' : 'Ponytail', value: 'ponytail' },
          { name: locale === 'zh-CN' ? '被遮挡' : 'Obscured', value: 'covered' },
          { name: locale === 'zh-CN' ? '盘发' : 'Updo', value: 'updo' }],
        key: 'hair',
      },
      {
        name: locale === 'zh-CN' ? '帽子' : 'Hat',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '未戴帽子' : 'No Hat', value: 'no hat or helmet' },
          { name: locale === 'zh-CN' ? '戴帽子' : 'Wearing a Hat', value: 'wearing a hat' },
          { name: locale === 'zh-CN' ? '戴头盔' : 'Wearing a Helmet', value: 'wearing a helmet' },
          { name: locale === 'zh-CN' ? '连衣帽' : 'Hoodie', value: 'wearing a caps' },
          { name: locale === 'zh-CN' ? '头巾' : 'Scarf', value: 'wearing a headscarf' }],
        key: 'hat',
      },
      {
        name: locale === 'zh-CN' ? '背包' : 'Carrying Bag',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '未背包' : 'No Bag', value: 'no knapsack' },
          { name: locale === 'zh-CN' ? '双肩包' : 'Backpack', value: 'have knapsack' },
          { name: locale === 'zh-CN' ? '未确定' : 'Undetermined', value: 'uncertain' }],
        key: 'knapsack',
      },
      {
        name: locale === 'zh-CN' ? '口罩' : 'Mask',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '无' : 'No', value: 'no mask' },
          { name: locale === 'zh-CN' ? '有' : 'Yes', value: 'mask' },
          { name: locale === 'zh-CN' ? '未识别' : 'Unidentified', value: 'uncertain' }],
        key: 'mask',
      },
      {
        name: locale === 'zh-CN' ? '眼镜' : 'Glasses',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '无' : 'No', value: 'no glasses' },
          { name: locale === 'zh-CN' ? '有' : 'Yes', value: 'have glasses' }],
        key: 'glasses',
      },
      {
        name: locale === 'zh-CN' ? '拉杆箱' : 'Suitcase',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '无' : 'No', value: 'no trolleycase' },
          { name: locale === 'zh-CN' ? '有' : 'Yes', value: 'have trolleycase' }],
        key: 'trolleycase',
      },
      {
        name: locale === 'zh-CN' ? '手推车' : 'Trolley',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '无' : 'No', value: 'no barrow' },
          { name: locale === 'zh-CN' ? '有' : 'Yes', value: 'have barrow' }],
        key: 'barrow',
      },
      {
        name: locale === 'zh-CN' ? '抱小孩' : 'Child',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '无' : 'Not holding Child', value: 'no baby' },
          { name: locale === 'zh-CN' ? '有' : 'Holding Child', value: 'cradling a baby' },
          { name: locale === 'zh-CN' ? '背小孩' : 'Child on the Back', value: 'carry a baby on the back' }],
        key: 'baby',
      },
      {
        name: locale === 'zh-CN' ? '手提物' : 'Carrying Items',
        value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
          { name: locale === 'zh-CN' ? '拎东西' : 'Carrying Items', value: 'carry something in hand' },
          { name: locale === 'zh-CN' ? '未拎东西' : 'Not Carrying Items', value: 'carry nothing in hand' }],
        key: 'bag',
      },
    ]
  );
}

// 人体上装特征
export function JACKET_FEATURE(locale = 'zh-CN') {
  return ([
    {
      name: locale === 'zh-CN' ? '纹理' : 'Top Texture',
      value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
        { name: locale === 'zh-CN' ? '格子' : 'Plaid', value: 'plaid' },
        { name: locale === 'zh-CN' ? '花纹' : 'Pattern', value: 'flower pattern' },
        { name: locale === 'zh-CN' ? '条纹' : 'Stripe', value: 'stripe' },
        { name: locale === 'zh-CN' ? '纯色' : 'Pure Color', value: 'pure color' }],
      key: 'uppertexture',
    },
    {
      name: locale === 'zh-CN' ? '款式' : 'Top Pattern',
      value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
        { name: locale === 'zh-CN' ? '长袖' : 'Long Sleeve', value: 'long sleeve' },
        { name: locale === 'zh-CN' ? '短袖' : 'Short Sleeve', value: 'short sleeve' },
        { name: locale === 'zh-CN' ? '羽绒服' : 'Down Jacket', value: 'down jacket' },
        { name: locale === 'zh-CN' ? '普通外套' : 'Ordinary Coat', value: 'ordinary coat' },
        { name: locale === 'zh-CN' ? '无外套' : 'No Coat', value: 'no coat' }],
      key: 'uppertype',
    },
    {
      name: locale === 'zh-CN' ? '颜色' : 'Top Color',
      value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
        { name: locale === 'zh-CN' ? '灰' : 'Grey', value: 'gray' }, { name: locale === 'zh-CN' ? '白' : 'White', value: 'white' },
        { name: locale === 'zh-CN' ? '红' : 'Red', value: 'red' }, { name: locale === 'zh-CN' ? '绿' : 'Green', value: 'green' },
        { name: locale === 'zh-CN' ? '蓝' : 'Blue', value: 'blue' }, { name: locale === 'zh-CN' ? '黄' : 'Yellow', value: 'yellow' },
        { name: locale === 'zh-CN' ? '黑' : 'Black', value: 'black' }, { name: locale === 'zh-CN' ? '紫' : 'Purple', value: 'purple' },
        { name: locale === 'zh-CN' ? '深灰' : 'Dark Gray', value: 'dark gray' }],
      key: 'uppercolor',
    },
  ]);
}

// 人体下装特征
export function BOTTOMS_FEATURE(locale = 'zh-CN') {
  return ([
    {
      name: locale === 'zh-CN' ? '款式' : 'Bottoms Style',
      value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
        { name: locale === 'zh-CN' ? '长裤' : 'Pants', value: 'full length pants' },
        { name: locale === 'zh-CN' ? '短裤' : 'Shorts', value: 'shorts' },
        { name: locale === 'zh-CN' ? '七分裤' : 'Cropped Trousers', value: 'capri pants' },
        { name: locale === 'zh-CN' ? '裙子' : 'Skirt', value: 'skirt' }],
      key: 'bottomtype',
    },
    {
      name: locale === 'zh-CN' ? '颜色' : 'Bottoms Color',
      value: [{ name: locale === 'zh-CN' ? '全部' : 'All', value: 'all' },
        { name: locale === 'zh-CN' ? '灰' : 'Grey', value: 'gray' }, { name: locale === 'zh-CN' ? '白' : 'White', value: 'white' },
        { name: locale === 'zh-CN' ? '红' : 'Red', value: 'red' }, { name: locale === 'zh-CN' ? '绿' : 'Green', value: 'green' },
        { name: locale === 'zh-CN' ? '蓝' : 'Blue', value: 'blue' }, { name: locale === 'zh-CN' ? '黄' : 'Yellow', value: 'yellow' },
        { name: locale === 'zh-CN' ? '黑' : 'Black', value: 'black' }, { name: locale === 'zh-CN' ? '紫' : 'Purple', value: 'purple' },
        { name: locale === 'zh-CN' ? '深灰' : 'Dark Gray', value: 'dark gray' }],
      key: 'bottomcolor',
    },
  ]);
}

export const TRANSLATE_TARGET = {
  male: 'Male',
  female: 'Female',
  child: 'Children',
  youth: 'Youth',
  'middle age': 'Middle Age',
  'old age': 'Agedness',
  teenager: 'Juvenile',
  front: 'Front',
  back: 'Back',
  side: 'Side',
  left: 'Left',
  right: 'Right',
  'no umbrella': 'Without Umbrella',
  'holding an umbrella': 'Holding an Umbrella',
  'long hair': 'Long Hair',
  'short hair': 'Short Hair',
  ponytail: 'Ponytail',
  covered: 'Obscured',
  updo: 'Updo',
  'no hat or helmet': 'No Hat',
  'wearing a hat': 'Wearing a Hat',
  'wearing a helmet': 'Wearing a Helmet',
  'wearing a caps': 'Hoodie',
  'wearing a headscarf': 'Scarf',
  'no knapsack': 'No Bag',
  'have knapsack': 'Backpack',
  uncertain: 'Undetermined',
  'no mask': 'No',
  mask: 'Yes',
  'no glasses': 'No',
  'have glasses': 'Yes',
  'no trolleycase': 'No',
  'have trolleycase': 'Yes',
  'no barrow': 'No',
  'have barrow': 'Yes',
  'no baby': 'Not holding Child',
  'cradling a baby': 'Holding Child',
  'carry a baby on the back': 'Child on the Back',
  'carry something in hand': 'Carrying Items',
  'carry nothing in hand': 'Not Carrying Items',
  plaid: 'Plaid',
  'flower pattern': 'Pattern',
  stripe: 'Stripe',
  'pure color': 'Pure Color',
  'long sleeve': 'Long Sleeve',
  'short sleeve': 'Short Sleeve',
  white: 'White',
  green: 'Green',
  yellow: 'Yellow',
  purple: 'Purple',
  'dark gray': '',
  red: 'Red',
  blue: 'Blue',
  black: 'Black',
  gray: 'Dark Gray',
  'full length pants': 'Pants',
  shorts: 'Shorts',
  'capri pants': 'Cropped Trousers',
  skirt: 'Skirt',
  'down jacket': 'Down Jacket',
  'ordinary coat': 'Ordinary Coat',
  'no coat': 'No Coat',
};
