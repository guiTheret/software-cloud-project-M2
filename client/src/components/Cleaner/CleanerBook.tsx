import { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";

import CleanerCard from './CleanerCard';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import api from "../../api/api.js"
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CleanerBook() {
    const { state } = useLocation();
    const cleaner = state.cleaner;
    const [cleanerDate, setCleanerDate] = useState<Array<any>>([]);
    const [idSelected, setIdSelected] = useState<Array<Date>>([]);

    const [showModal, setShowModal] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const baseDate = new Date();
    const baseDatePlusOne = new Date(baseDate.setDate(baseDate.getDate() + 1));

    const [selectedDate, setSelectedDate] = useState<Date>(baseDatePlusOne);
    const todayDate = baseDatePlusOne;
    const [error, setError] = useState<string>("");
    const [confirmModalMessage, setConfirmModalMessage] = useState<string>("")


    const getCleanerAgenda = () => {
        api.get(`/cleaner/getAvailableByDay/${cleaner.id}/${selectedDate.getFullYear()}/${selectedDate.getMonth()}/${selectedDate.getDate()}`)
            .then(response => {
                setCleanerDate(response.data)
                console.log(response.data)
                setIdSelected([]);
            })
    }
    useEffect(() => {
        getCleanerAgenda();
        setError("");
    }, [selectedDate])
    useEffect(() => {
        getCleanerAgenda()
    }, [])

    const setPreviousDay = () => {
        var newDate = new Date(selectedDate.setDate(selectedDate.getDate() - 1));
        setSelectedDate(newDate);
    }

    const setNextDay = () => {
        var newDate = new Date(selectedDate.setDate(selectedDate.getDate() + 1));
        setSelectedDate(newDate);
    }
    const setSelected = (date: Date) => {
        setIdSelected(oldArray => {
            console.log(oldArray.includes(date))
            if (oldArray.includes(date)) {
                return oldArray.filter(item => item !== date);
            } else {
                return [...oldArray, date];
            }
        })
    }
    const validate = () => {
        setLoading(true);
        api.post("/cleaner/bookCleaner", {
            arrayDate: idSelected,
            idCleaner: cleaner.id
        })
            .then(response => {
                setLoading(false);
                setConfirmModalMessage(response.data.message);
                setSelectedDate(baseDate);
            })
            .catch(err => setLoading(false));
    }
    const shouldShowModal = () => {
        if (idSelected.length === 0) return setError("Did you book anything ?")
        setShowModal(true)
    }
    const closeModal = () => {
        setLoading(false);
        setShowModal(false);
    }
    const isSelected = (date: Date) => {
        let found = false;
        idSelected.forEach(value => {
            if (value.getTime() === date.getTime()) {
                found = true;
            }
        })
        return found;
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Modal show={showModal} onHide={() => closeModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {confirmModalMessage === "" ? (
                        <div><p>Are you sure to book {cleaner.firstName} {cleaner.lastName} ?</p>
                            <p>Total Cost is : {idSelected.length * 30}€ </p></div>
                    ) : (
                        <p>{confirmModalMessage}</p>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    {confirmModalMessage === "" &&
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                            {loading === true ? (
                                <Spinner animation="border" variant="primary" />
                            ) : (
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                                    <Button variant="secondary" onClick={() => closeModal()}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={() => validate()}>
                                        Yes !
                                    </Button>
                                </div>
                            )}

                        </div>
                    }

                </Modal.Footer>
            </Modal>
            <CleanerCard cleaner={cleaner} displayButton={false} />
            <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: "2rem" }}>Here are the next availabilities for {cleaner.firstName} </div>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {selectedDate.toLocaleDateString("fr-FR") !== todayDate.toLocaleDateString("fr-FR") &&
                    <Button style={{ marginRight: 10 }} onClick={() => setPreviousDay()} variant="outline-primary">Previous day</Button>
                }
                <div>{selectedDate.getDate()} {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}</div>
                <Button style={{ marginLeft: 10 }} onClick={() => setNextDay()} variant="outline-primary">Next day</Button>
            </div>
            <div>
                {cleanerDate.length === 0 ? (
                    <div>No slot available for {cleaner.firstName} {cleaner.lastName}</div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "row", maxWidth: "400px", flexWrap: "wrap", justifyContent: "center" }}>
                            {cleanerDate.map((value, index) => {
                                const date = new Date(value.date);
                                if (value.available) {
                                    return (
                                        <div key={index} onClick={() => setSelected(date)} style={{ padding: 10, backgroundColor: isSelected(date) === true ? "red" : "#0D6EFD", margin: 5, width: 100, alignItems: "center", height: 50, borderRadius: 5 }}>
                                            <p style={{ color: "white", fontWeight: "bold", textAlign: "center" }}> {date.getHours()}h{date.getMinutes() === 0 ? "00" : "30"} </p>
                                        </div>
                                    )
                                } else {
                                    return (<></>)
                                }

                            })}
                        </div>
                        <div>Current Order : {idSelected.length * 30} €</div>
                        <div style={{ color: "red", fontWeight: "bold" }}>{error}</div>
                        <Button style={{ marginBottom: 30, marginTop: 5 }} onClick={() => shouldShowModal()} variant="success">Validate</Button>
                    </div>
                )}

            </div>

        </div >
    )
}
