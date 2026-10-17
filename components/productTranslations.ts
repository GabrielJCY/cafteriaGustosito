// Diccionario local ES -> EN. Las claves se normalizan para ignorar tildes,
// mayúsculas y espacios repetidos. No requiere API ni base de datos adicional.
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim().replace(/\s+/g, " ");
}

const traducciones: Record<string, string> = {
  "sandwich de huevo": "Egg Sandwich",
  "delicioso y sabroso sandwich de huevo, con tomate, cebolla y tambien anadir cosas a sus preferencias.":
    "A delicious egg sandwich with tomato and onion. Add extra ingredients to suit your taste.",
  "cafe": "Coffee",
  "bebida caliente de aroma intenso y sabor agradable, ideal para comenzar el dia con energia o disfrutar de una pausa reconfortante en cualquier momento.":
    "A hot drink with a rich aroma and pleasant flavor, perfect for starting the day with energy or enjoying a relaxing break.",
  "combo illimani": "Illimani Combo",
  "delicioso combo que combina huevo, carne jugosa, salchicha y un sabroso postre de chorrellana, acompanado de mayonesa, ketchup y mostaza. su irresistible juguito de la carne realza cada bocado, creando una mezcla de sabores intensos y deliciosos que hacen de este combo una opcion ideal para disfrutar de una comida completa y llena de sabor.":
    "A hearty combo featuring egg, juicy beef, sausage and savory chorrellana, served with mayonnaise, ketchup and mustard. The flavorful meat juices make every bite rich and satisfying.",
  "desayuno yungueno": "Yungas Breakfast",
  "tradicional desayuno de los yungas que combina cafe yungueno de aroma intenso y sabor autentico, acompanado de pan y otros complementos segun la preparacion. una opcion deliciosa y reconfortante, ideal para comenzar el dia disfrutando del sabor caracteristico de nuestra region.":
    "A traditional Yungas breakfast with aromatic local coffee, bread and other accompaniments depending on preparation. A comforting way to start the day with authentic regional flavors.",
  "sandwiches": "Sandwiches", "sandwich": "Sandwiches", "bebidas": "Drinks", "bebidas calientes": "Hot Drinks",
  "bebidas frias": "Cold Drinks", "combos": "Combos", "desayunos": "Breakfasts",
  "cafe y bebidas": "Coffee & Drinks", "comidas": "Meals", "platos": "Dishes",
  "postres": "Desserts", "extras": "Extras", "infusiones": "Herbal Teas",
  "refrescos": "Refreshments", "gaseosas": "Sodas", "para el frio": "Warm Drinks",
};

export function traduccionLocal(texto: string): string {
  return traducciones[normalizar(texto)] ?? texto;
}
