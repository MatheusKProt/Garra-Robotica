import React, { useEffect, useState, useMemo } from "react";
import socketio from "socket.io-client";

export default function Dashboard() {
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [z, setZ] = useState("");
  const [gripper, setGripper] = useState("");

  const socket = useMemo(
    () =>
      socketio("http://localhost:3333", {
        query: { user_id: 1 }
      }),
    []
  );

  useEffect(() => {
    function handleKeydown(event) {
      if (event.key === "q") {
        socket.emit("rotation", { action: "plus" });
        return;
      } else if (event.key === "a") {
        socket.emit("rotation", { action: "minus" });
        return;
      } else if (event.key === "w") {
        socket.emit("elevation", { action: "plus" });
        return;
      } else if (event.key === "s") {
        socket.emit("elevation", { action: "minus" });
        return;
      } else if (event.key === "e") {
        socket.emit("extension", { action: "plus" });
        return;
      } else if (event.key === "d") {
        socket.emit("extension", { action: "minus" });
        return;
      } else if (event.key === "r") {
        socket.emit("gripper", { action: "plus" });
        return;
      } else if (event.key === "f") {
        socket.emit("gripper", { action: "minus" });
        return;
      }
    }

    const throttledKeydown = throttle(handleKeydown, 80);
    document.addEventListener("keydown", throttledKeydown);
  }, [socket]);

  function handleSubmit(event) {
    event.preventDefault();

    socket.emit("xyz", {
      x,
      y,
      z,
      gripper
    });
  }

  function throttle(callback, delay) {
    let isThrottled = false,
      args,
      context;
    function wrapper() {
      if (isThrottled) {
        args = arguments;
        context = this;
        return;
      }
      isThrottled = true;
      callback.apply(this, arguments);
      setTimeout(() => {
        isThrottled = false;
        if (args) {
          wrapper.apply(context, args);
          args = context = null;
        }
      }, delay);
    }
    return wrapper;
  }

  return (
    <>
      <p>Texto para posicionar o braço</p>

      <form className="xyz" onSubmit={handleSubmit}>
        <label htmlFor="x">X:</label>
        <input
          type="number"
          id="x"
          min="-39"
          max="39"
          placeholder="Insira um valor"
          value={x}
          onChange={event => setX(event.target.value)}
        />

        <label htmlFor="y">Y:</label>
        <input
          type="number"
          id="y"
          min="-39"
          max="39"
          placeholder="Insira um valor"
          value={y}
          onChange={event => setY(event.target.value)}
        />

        <label htmlFor="z">Z:</label>
        <input
          type="number"
          id="z"
          min="16"
          max="54"
          placeholder="Insira um valor"
          value={z}
          onChange={event => setZ(event.target.value)}
        />

        <label htmlFor="gripper">Garra:</label>
        <input
          type="number"
          id="gripper"
          min="0"
          max="100"
          placeholder="Insira um valor entre 0 e 100"
          value={gripper}
          onChange={event => setGripper(event.target.value)}
        />

        <button type="submit" className="btn">
          Posicionar
        </button>
      </form>
    </>
  );
}
