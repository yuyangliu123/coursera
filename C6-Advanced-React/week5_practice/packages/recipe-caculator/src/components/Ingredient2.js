import { useState } from "react"
import * as XLSX from 'xlsx';

const Ingredient2 = () => {
    const [item, setItem] = useState({
        ingre: "",
        weight: "",
        percent: 0
    })
    const [items, setItems] = useState([])

    const updatePercentages = (newList) => {
        const flourWeight = newList.reduce((total, item) => item.ingre.includes("flour") ? total + item.weight : total, 0);
        return newList.map(item => ({
            ...item,
            percent: flourWeight !== 0 ? ((item.weight / flourWeight) * 100).toFixed(2) : 0
        }));
    }

    const handleAdd = () => {
        let newList = [...items, { ...item, weight: Number(item.weight), percent: 0 }];
        newList = updatePercentages(newList);
        setItems(newList);
        setItem({ ingre: "", weight: "", percent: 0 });
    }

    const handleInputChange = (index, field, value) => {
        // Deep copy the items array
        let newList = JSON.parse(JSON.stringify(items));
        if (newList[index][field] === value) return; // avoid unnecessary state update
        newList[index][field] = value;
        if (field === 'weight') {
            newList[index][field] = Number(value); // ensure weight is a number
            newList = updatePercentages(newList);
        }
        setItems(newList);
    }
    

    const handleDownload = () => {
        const ws = XLSX.utils.json_to_sheet(items);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "items.xlsx");
    }

    const totalWeight=items.reduce((total,item)=>total+item.weight,0)
    return (
        <>
            <input value={item.ingre} onChange={(e) => { setItem({ ...item, ingre: e.target.value }) }} placeholder="Ingredient" />
            <input value={item.weight} onChange={(e) => { setItem({ ...item, weight: e.target.value }) }} placeholder="Weight" />
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleDownload}>Download</button>
            <table>
                <thead>
                    <tr>
                        <th>
                            Ingredient
                        </th>
                        <th>
                            Weight
                        </th>
                        <th>
                            Percent %
                        </th>
                        <th>
                            Total weight
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td><input value={item.ingre} onChange={(e) => handleInputChange(index, 'ingre', e.target.value)} /></td>
                            <td><input value={item.weight} onChange={(e) => handleInputChange(index, 'weight', e.target.value)} /></td>
                            <td>{item.percent}%</td>
                            <td>{totalWeight}</td>
                        </tr>
                    ))}
                        
                            
                </tbody>
                
            </table>
        </>
    )
}

export default Ingredient2
