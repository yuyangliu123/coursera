import React, { useState } from 'react';
import * as XLSX from "xlsx"

function IngredientList() {
  const [ingredient, setIngredient] = useState('');
  const [weight, setWeight] = useState('');
  const [list, setList] = useState([]);

  const updatePercentages = (newList) => {
    const flourWeight=newList.reduce((total,item)=>item.ingredient.includes("flour")?total+item.weight:total,0)
    return newList.map(item=>({
      ...item,
      percentage:flourWeight!==0?((item.weight/flourWeight)*100).toFixed(2):0
    }))
  }

  const handleAdd = () => {
    let newList = [...list, { ingredient, weight: Number(weight), percentage: 0 }];
    newList = updatePercentages(newList);
    setList(newList);
    setIngredient('');
    setWeight('');
  };

  const handleEdit = (index, field, value) => {
    let newList = JSON.parse(JSON.stringify(list));
    if (newList[index][field] === value) return; // avoid unnecessary state update
    newList[index][field] = field === 'weight' ? Number(value) : value;
    if(field==="weight"){
      newList[index][field]=Number(value)
      newList = updatePercentages(newList);
    }
    setList(newList);
  };

  const handleDownload = () => {
    const ws = XLSX.utils.json_to_sheet(list);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "items.xlsx");
  }

  return (
    <div>
      <input value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="Ingredient" />
      <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" />
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleDownload}>Download</button>
      <table>
        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Weight</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index}>
              <td><input value={item.ingredient} onChange={(e) => handleEdit(index, 'ingredient', e.target.value)} /></td>
              <td><input value={item.weight} onChange={(e) => handleEdit(index, 'weight', e.target.value)} /></td>
              <td>{item.percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IngredientList;
