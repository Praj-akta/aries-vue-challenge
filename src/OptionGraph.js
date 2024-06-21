import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./App.css";

Chart.register(...registerables);

const OptionGraph = () => {
  const [optionsContracts, setOptionsContracts] = useState([]);
  const [newContract, setNewContract] = useState({
    type: "call",
    strike: 0,
    premium: 0,
  });

  const handleAddContract = (e) => {
    e.preventDefault();
    if (optionsContracts.length < 4) {
      setOptionsContracts([...optionsContracts, newContract]);
      setNewContract({ type: "call", strike: 0, premium: 0 });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContract({ ...newContract, [name]: parseFloat(value) });
  };

  const calculateProfitLoss = (price) => {
    let profitLoss = 0;
    optionsContracts.forEach((contract) => {
      const { type, strike, premium } = contract;
      if (type === "call") {
        profitLoss += Math.max(0, price - strike) - premium;
      } else if (type === "put") {
        profitLoss += Math.max(0, strike - price) - premium;
      }
    });
    return profitLoss;
  };

  const prices = Array.from({ length: 201 }, (_, i) => i * 0.5); // Prices from 0 to 100
  const profitLossData = prices.map((price) => calculateProfitLoss(price));

  const data = {
    labels: prices,
    datasets: [
      {
        label: "Profit/Loss",
        data: profitLossData,
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
  };

  const maxProfit = Math.max(...profitLossData);
  const maxLoss = Math.min(...profitLossData);
  const breakEvenPoints = prices.filter(
    (_, index) => profitLossData[index] === 0
  );

  return (
    <div className="container">
      <h2>Risk & Reward Graph</h2>
      <form onSubmit={handleAddContract}>
        <select name="type" value={newContract.type} onChange={handleChange}>
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
        <input
          type="number"
          name="strike"
          value={newContract.strike}
          onChange={handleChange}
          placeholder="Strike Price"
        />
        <input
          type="number"
          name="premium"
          value={newContract.premium}
          onChange={handleChange}
          placeholder="Premium"
        />
        <button type="submit">Add Contract</button>
      </form>
      <Line data={data} options={options} />

      <div className="contracts">
        <h3>Contracts</h3>
        <ul>
          {optionsContracts.map((contract, index) => (
            <li key={index}>
              {contract.type} - Strike: {contract.strike}, Premium:{" "}
              {contract.premium}
            </li>
          ))}
        </ul>
      </div>
      <div className="summary">
        <h3>Summary</h3>
        <p>Max Profit: {maxProfit}</p>
        <p>Max Loss: {maxLoss}</p>
        <p>Break-even Points: {breakEvenPoints.join(", ")}</p>
      </div>
    </div>
  );
};

export default OptionGraph;
