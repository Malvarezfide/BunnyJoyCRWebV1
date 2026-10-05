import "./DragDropArea.css";
import { useState } from "react";

export default function DragDropArea({

  children,

  onFiles,

}) {

  const [dragging, setDragging] = useState(false);

  function isFileDrag(e) {

    return Array.from(
      e.dataTransfer.types
    ).includes("Files");

  }

  function prevent(e) {

    if (!isFileDrag(e)) {

      return;

    }

    e.preventDefault();
    e.stopPropagation();

  }

  function handleDragEnter(e) {

    if (!isFileDrag(e)) {

      return;

    }

    prevent(e);

    setDragging(true);

  }

  function handleDragOver(e) {

    if (!isFileDrag(e)) {

      return;

    }

    prevent(e);

  }

  function handleDragLeave(e) {

    if (!isFileDrag(e)) {

      return;

    }

    prevent(e);

    if (e.currentTarget === e.target) {

      setDragging(false);

    }

  }

  function handleDrop(e) {

    if (!isFileDrag(e)) {

      return;

    }

    prevent(e);

    setDragging(false);

    const files = Array.from(
      e.dataTransfer.files
    );

    if (!files.length) {

      return;

    }

    onFiles(files);

  }

  return (

    <div

      className={
        `drag-drop-area ${
          dragging ? "dragging" : ""
        }`
      }

      onDragEnter={handleDragEnter}

      onDragOver={handleDragOver}

      onDragLeave={handleDragLeave}

      onDrop={handleDrop}

    >

      {children}

    </div>

  );

}