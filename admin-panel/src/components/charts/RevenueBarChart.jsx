import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RevenueBarChart = ({ data }) => {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            dy={10}
            tickFormatter={(str) => {
                const date = new Date(str);
                return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            tickFormatter={(val) => `KSh ${val.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px'
            }}
            formatter={(val) => [`KSh ${val.toLocaleString()}`, '']}
            labelFormatter={(str) => new Date(str).toLocaleDateString('en-KE', { dateStyle: 'long' })}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }} />
          <Bar dataKey="deposit" name="Deposits" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="balance" name="Balances" fill="#14B8A6" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueBarChart;
