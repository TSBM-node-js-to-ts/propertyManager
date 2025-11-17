import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 백엔드 API 주소
const API_URL = 'http://localhost:3000/api';

function App() {
  const [properties, setProperties] = useState([]);
  const [formState, setFormState] = useState({
    address: '',
    type: '원룸',
    priceDeposit: 0,
    priceMonth: 0,
    mapUrl: '',
  });

  // 1. 페이지 로드 시 매물 목록 불러오기
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/properties`);
      setProperties(response.data);
    } catch (error) {
      console.error('매물 로딩 실패:', error);
    }
  };

  // 2. 매물 등록하기
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formState.address || !formState.type) {
      alert('주소와 매물 종류를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/properties`, formState);
      // 화면에 바로 추가
      setProperties([response.data, ...properties]);
      // 입력창 비우기
      setFormState({
        address: '',
        type: '원룸',
        priceDeposit: 0,
        priceMonth: 0,
        mapUrl: '',
      });
    } catch (error) {
      console.error('등록 실패:', error);
      alert('등록에 실패했습니다.');
    }
  };

  // 3. 매물 삭제하기
  const deleteProperty = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`${API_URL}/properties/${id}`);
      // 화면에서 삭제된 것 안 보이게 처리
      setProperties(properties.filter((p) => p.id !== id));
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: (name === 'priceDeposit' || name === 'priceMonth') ? Number(value) : value,
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>부동산 매물 관리</h1>

      {/* 등록 폼 */}
      <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '8px' }}>
        <h2>새 매물 등록</h2>
        <form onSubmit={handleFormSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'inline-block', width: '100px' }}>주소:</label>
            <input
              name="address"
              value={formState.address}
              onChange={handleInputChange}
              placeholder="예: 노고산동 107-17"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'inline-block', width: '100px' }}>종류:</label>
            <input
              name="type"
              value={formState.type}
              onChange={handleInputChange}
              placeholder="예: 원룸"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'inline-block', width: '100px' }}>보증금:</label>
            <input
              type="number"
              name="priceDeposit"
              value={formState.priceDeposit}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'inline-block', width: '100px' }}>월세:</label>
            <input
              type="number"
              name="priceMonth"
              value={formState.priceMonth}
              onChange={handleInputChange}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'inline-block', width: '100px' }}>지도 링크:</label>
            <input
              name="mapUrl"
              value={formState.mapUrl}
              onChange={handleInputChange}
              placeholder="https://map.kakao.com/..."
              style={{ width: '300px' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', cursor: 'pointer' }}>
            등록하기
          </button>
        </form>
      </div>

      {/* 매물 목록 */}
      <h2>매물 목록</h2>
      <div>
        {properties.length === 0 ? <p>등록된 매물이 없습니다.</p> : null}
        {properties.map((prop) => (
          <div key={prop.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
            <h3>{prop.address} <span style={{ fontSize: '0.8em', color: '#666' }}>({prop.type})</span></h3>
            <p>보증금: {prop.priceDeposit} / 월세: {prop.priceMonth}</p>
            {prop.mapUrl && (
              <a href={prop.mapUrl} target="_blank" rel="noreferrer" style={{ color: 'blue', marginRight: '10px' }}>
                지도 보기
              </a>
            )}
            <button onClick={() => deleteProperty(prop.id)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;