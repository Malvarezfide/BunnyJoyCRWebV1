export default function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={onClose}>✖</button>
        {children}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    width: "500px",
    position: "relative",
  },
  close: {
    position: "absolute",
    right: 10,
    top: 10,
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
  },
};