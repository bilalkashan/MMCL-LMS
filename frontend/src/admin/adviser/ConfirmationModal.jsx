import React, { useState } from "react";
import styles from "./AddAdviserModal.module.css";
import { handleError } from "../../toast";

const ConfirmationModal = ({ type, message, onConfirm, onCancel }) => {
    const [reg1, setReg1] = useState("");
    const [reg2, setReg2] = useState("");

    const handleConfirm = () => {
        if (type === "reservation") {
            if (reg1.trim() === "" || reg2.trim() === "") {
                handleError("Both registration numbers are required!");
                return;
            }
            onConfirm({ reg1, reg2 });
        } else {
            onConfirm();
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <p>{message}</p>

                {type === "reservation" && (
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="Enter First Registration Number"
                            value={reg1}
                            onChange={(e) => setReg1(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Enter Second Registration Number"
                            value={reg2}
                            onChange={(e) => setReg2(e.target.value)}
                        />
                    </div>
                )}

                <div className={styles.actions}>
                    <button className={styles.confirmButton} onClick={handleConfirm}>
                        Confirm
                    </button>
                    <button className={styles.cancelButton} onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;