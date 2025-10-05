export const category = [
  {
    img: "https://naturalselectionlondon.com/wp-content/uploads/2022/07/How-To-Wear-The-Smart-Casual-Dress-Code-For-Men.jpg",
    name: "Casual Wear",
    off: "20-40% OFF",
  },
  {
    img: "https://assets.myntassets.com/dpr_1.5,q_60,w_400,c_limit,fl_progressive/assets/images/24439364/2023/8/10/a157968c-bc17-4fa8-b805-31f930c47b381691681709790MenBlackSolidSlimFitFormalBlazer1.jpg",
    name: "Formal Wear",
    off: "10-20% OFF",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqR8nb8uO-HERwcu2eIWBFaSY7DC_KaX19hvBNApYgTgacS1Hhhx8WJOY_-jacJnwzXqY&usqp=CAU",
    name: "Winter Wear",
    off: "20-40% OFF",
  },
  {
    img: "https://images.bewakoof.com/utter/content/2484/content_western_dress_3.jpg",
    name: "Western Wear",
    off: "30-40% OFF",
  },
  {
    img: "https://assets0.mirraw.com/images/11782208/3283579_long_webp.webp?1696934926",
    name: "Ethnic Wear",
    off: "10-40% OFF",
  },
];

export const filter = [
  {
    name: "Product Categories",
    value: "category",
    items: [
      "Men",
      "Women",
      "Kids",
      "Bags",
      "Accessories",
      "Casual Wear",
      "Formal Wear",
      "Winter Wear",
      "Ethnic Wear",
    ],
  },
  {
    name: "Filter by Price",
    value: "price",
    items: [],
  },
  {
    name: "Filter by Size",
    value: "size",
    items: ["S", "M", "L", "XL", "XXL"],
  },
];

// Add this new sample products array
export const sampleProducts = [
  {
    _id: "sample1",
    title: "Urban Explorer Jacket",
    img: "https://images.unsplash.com/photo-1551028719-00167b16e2d8?q=80&w=300",
    price: { org: 450, mrp: 900 },
    rating: 4.5,
  },
  {
    _id: "sample2",
    title: "Classic Denim Shirt",
    img: "https://images.unsplash.com/photo-1602293589914-9e19a7a83515?q=80&w=300",
    price: { org: 280, mrp: 500 },
    rating: 4.7,
  },
  {
    _id: "sample3",
    title: "Minimalist White Tee",
    img: "https://images.unsplash.com/photo-1581655353564-df123a164d2b?q=80&w=300",
    price: { org: 150, mrp: 300 },
    rating: 4.8,
  },
  {
    _id: "sample4",
    title: "Elegant Formal Trousers",
    img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=300",
    price: { org: 350, mrp: 750 },
    rating: 4.6,
  },
];