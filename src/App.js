import React, { useState } from "react";
const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  function HandleAddItems(newitem) {
    setItems((items) => [...items, newitem]);
  }
  function HandleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function HandleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  return (
    <div className="app">
      <Logo />
      <Form onAddItems={HandleAddItems} />
      <PackingLists
        items={items}
        onDeleteItems={HandleDeleteItems}
        onToggleItems={HandleToggleItem}
      />
      <Stats items={items} />
    </div>
  );
}
function Logo() {
  return <h1> 🏖️ Far Away 👜 </h1>;
}
function Form({ onAddItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    //console.log(e); //to disable the default behaviour of HTML (ie) to avoid reloading,building a single page application

    if (!description) return;
    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };
    console.log(newItem);
    onAddItems(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3> What do you need for your Trip?</h3>
      <select
        value={quantity}
        onChange={(quantity) => setQuantity(Number(quantity.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map(
          (
            num // _: This represents the value of each element in the array (which is not used here, hence the underscore _).
          ) => (
            //i: This is the index of the current element (ranging from 0 to 19 for an array of length 20).
            <option value={num} key={num}>
              {num}
            </option>
          )
        )}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button> Add</button>
    </form>
  );
}
function PackingLists({ items, onDeleteItems, onToggleItems }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;
  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItems={onDeleteItems}
            onToggleItems={onToggleItems}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input"> Sort By Input Order</option>
          <option value="description"> Sort by Description</option>
          <option value="packed"> Sort by Packed Status</option>
        </select>
      </div>
    </div>
  );
}
function Item({ item, onDeleteItems, onToggleItems }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItems(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItems(item.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list</em>
      </p>
    );
  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percent = Math.round(numPacked / numItems) * 100;
  return (
    <footer className="stats">
      <em>
        {percent === 100
          ? "You got everything! Ready to go✈️!"
          : ` $👜 You have ${numItems} items on your list, and you already packed
        ${numPacked} (${percent}%)`}
      </em>
    </footer>
  );
}
