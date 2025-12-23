'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useForm } from 'react-hook-form';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [monthlyTrends, setMonthlyTrends] = useState([]);

  const addExpense = (data) => {
    const newExpenses = [...expenses, data];
    setExpenses(newExpenses);
    // Dummy statistical update for monthly trends
    const newEntry = { month: 'Dec', amount: newExpenses.reduce((acc, item) => acc + parseFloat(item.amount), 0) };
    setMonthlyTrends([...monthlyTrends.filter((entry) => entry.month !== 'Dec'), newEntry]);
    reset();
  };

  const categories = expenses.reduce((acc, val) => {
    if (acc[val.category]) {
      acc[val.category] += parseFloat(val.amount);
    } else {
      acc[val.category] = parseFloat(val.amount);
    }
    return acc;
  }, {});

  const data = Object.keys(categories).map((key, index) => ({ name: key, value: categories[key] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <h1 className="text-4xl text-white font-bold mb-8">Personal Finance Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart for Categories */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-xl mb-4">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart for Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-xl mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              width={500}
              height={300}
              data={monthlyTrends}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Form to Add Expenses */}
        <div className="col-span-1 md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold text-xl mb-4">Add Expense</h2>
            <form onSubmit={handleSubmit(addExpense)} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <input
                className="border rounded p-2"
                {...register('category', { required: true })}
                placeholder="Category"
              />
              <input
                className="border rounded p-2"
                type="number"
                {...register('amount', { required: true })}
                placeholder="Amount"
              />
              <input
                className="border rounded p-2"
                type="date"
                {...register('date', { required: true })}
                placeholder="Date"
              />
              <button
                type="submit"
                className="col-span-1 md:col-span-3 bg-gradient-to-br from-pink-500 to-purple-600 text-white font-semibold py-2 rounded"
              >
                Add Expense
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}