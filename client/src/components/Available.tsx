import { useEffect, useState } from 'react'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from 'react-bootstrap/Button';

export default function Available() {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [availableDate, setAvailableDate] = useState<Array<displayDate>>([]);

    useEffect(() => {
        const today = new Date();
        const baseDate = startDate;

        if (baseDate < today) return setAvailableDate([]);
        const baseArray = [];
        baseDate.setHours(8, 0, 0);
        baseArray.push({ date: baseDate, isSelected: false });
        for (let i = 0; i < 19; i++) {
            const date = new Date(baseDate.getTime() + 30 * (i + 1) * 60000)
            if (date > today) {
                baseArray.push({ date, isSelected: false });
            }

        }

        setAvailableDate(baseArray);

    }, [startDate])
    const setSelected = (index: number) => {
        const newArray = [...availableDate];
        newArray[index].isSelected = !newArray[index].isSelected;
        setAvailableDate(newArray);
    }

    const selectAll = (bool: boolean) => {
        const newArray = [...availableDate];
        newArray.map((val, index) => {
            newArray[index].isSelected = bool;
        })
        setAvailableDate(newArray);
    }
    return (
        <>
            <div style={{ display: 'flex', flexDirection: "row", flexWrap: 'wrap', maxWidth: 500, justifyContent: 'center' }}>
                {availableDate.map((available, index) => {
                    return (
                        <div key={index} onClick={() => setSelected(index)} style={{ padding: 10, backgroundColor: available.isSelected === false ? "red" : "#0D6EFD", margin: 5, width: 100, alignItems: "center", height: 50, borderRadius: 5 }}>
                            <p style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>{available.date.getHours() + ":"}{available.date.getMinutes() === 30 ? "30" : "00"} H</p>
                        </div>
                    )
                })}
                {availableDate.length === 0 &&
                    <p>No time slot available for this date. Try another day</p>
                }
            </div>
            {availableDate.length > 0 &&
                <Button variant="success" onClick={() => selectAll(false)}>Validate</Button>
            }
        </>
    )
}
