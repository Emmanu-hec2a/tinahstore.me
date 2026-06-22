import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OrdersAreaChart = ({ data }) => {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
            </linearGradient>
          </defs>
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
          />
          <Tooltip
            contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '12px'
            }}
            labelFormatter={(str) => new Date(str).toLocaleDateString('en-KE', { dateStyle: 'long' })}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#06B6D4"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCount)"
            dot={{ r: 4, fill: '#06B6D4', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersAreaChart;
