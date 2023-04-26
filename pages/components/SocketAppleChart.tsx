import React from 'react';
import { useSocketData } from '../../utils/socket';

interface Data {
  image: string;
  prediction: any;
}

const SocketAppleChart: React.FC = () => {
  const URL = 'ws://172.21.4.223:8002/apple';
  const dataKeys = ['image', 'prediction'];
  const { data, loading } = useSocketData<Data>(URL, dataKeys);

  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  return (
    <div>
      <h2 className="clip-right mb-4 mt-8 ml-4 w-1/5 rounded-l border border-red-300 bg-orange-200 p-2 text-2xl font-bold">
        사과 가격 예측 그래프
      </h2>
      <img src={`data:image/png;base64,${data.image}`} alt="사과 가격 예측" />
    </div>
  );
};

export default SocketAppleChart;
