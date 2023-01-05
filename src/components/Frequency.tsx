import { useEffect, useState } from "react";

const Frequency: React.FC<{ frequency: string, onChange: (frequency: string) => void }> = (props) => {
    const units = [
        { value: 'd', display: 'Day' }, 
        { value: 'w', display: 'Week' }, 
        { value: 'm', display: 'Month' },
        { value: 'y', display: 'Year' }
    ];
    const [selectedUnit, setSelectedUnit] = useState(units.find(u => u.value === props.frequency[0]) || units[0]);
    const [selectedCount, setSelectedCount] = useState(+props.frequency.substring(1) || 1);
    const displayFrequency = 'Every ' + (selectedCount === 1 ? selectedUnit.display : selectedCount + ' ' + selectedUnit.display + 's');

    useEffect(() => {
        const frequency = selectedUnit.value + selectedCount;
        props.onChange(frequency);
    }, [props, selectedUnit, selectedCount]);
    
    const handleUnitChange = (unit: { value: string, display: string }) => {
        setSelectedUnit(unit);
    };

    const handleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = +event.target.value;
        setSelectedCount(value);
    };

    return <div className="frequency-input">
        <label htmlFor="frequency">Frequency - {displayFrequency}</label>
        <div className="frequency-unit">
            { units.map(unit => 
                <div key={unit.value} className={"frequency-unit-item " + (selectedUnit.value === unit.value ? "selected" : "")} onClick={handleUnitChange.bind(null, unit)}>
                    {unit.display}
                </div>
            )}
        </div>
        <input type="number" min="1" value={selectedCount} onChange={handleCountChange}/>
    </div>;
}

export default Frequency;