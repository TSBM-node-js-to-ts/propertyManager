import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function Login({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('STAFF');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      onLogin(res.data);
    } catch (error) {
      alert(error.response?.data?.message || '로그인 실패');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/auth/register`, { email, password, name, role });
      alert('가입 성공! 로그인해주세요.');
      setIsLoginMode(true);
    } catch (error) {
      alert(error.response?.data?.message || '가입 실패');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 80, fontFamily: 'sans-serif' }}>
      <div style={{ width: 350, padding: 30, border: '1px solid #ddd', borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#333' }}>🏢 부동산 매물 관리</h2>
        
        {/* 탭 메뉴 */}
        <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 20 }}>
          <div onClick={() => setIsLoginMode(true)} style={{ flex: 1, padding: 10, textAlign: 'center', cursor: 'pointer', fontWeight: isLoginMode ? 'bold' : 'normal', borderBottom: isLoginMode ? '2px solid #007bff' : 'none', color: isLoginMode ? '#007bff' : '#888' }}>로그인</div>
          <div onClick={() => setIsLoginMode(false)} style={{ flex: 1, padding: 10, textAlign: 'center', cursor: 'pointer', fontWeight: !isLoginMode ? 'bold' : 'normal', borderBottom: !isLoginMode ? '2px solid #007bff' : 'none', color: !isLoginMode ? '#007bff' : '#888' }}>회원가입</div>
        </div>

        <input placeholder="이메일" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="비밀번호" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle} />
        
        {!isLoginMode && (
          <>
            <input placeholder="이름 (예: 홍길동)" value={name} onChange={e=>setName(e.target.value)} style={inputStyle} />
            <select value={role} onChange={e=>setRole(e.target.value)} style={inputStyle}>
              <option value="STAFF">직원 (일반)</option>
              <option value="CEO">대표 (관리자)</option>
            </select>
          </>
        )}

        <button onClick={isLoginMode ? handleLogin : handleRegister} style={btnStyle}>
          {isLoginMode ? '로그인' : '회원가입 완료'}
        </button>
      </div>
    </div>
  );
}

function PropertyDetail() {
  const { id } = useParams();
  const [prop, setProp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/properties/${id}`).then(res => setProp(res.data)).catch(()=>alert('로딩 실패'));
  }, [id]);

  if (!prop) return <div style={{padding:30}}>⏳ 매물 정보를 불러오는 중...</div>;

  // 지도 링크 (주소 기반 자동 생성)
  const mapUrl = `https://map.kakao.com/link/search/${prop.address}`;

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 15, padding: '5px 10px', cursor:'pointer' }}>← 목록으로</button>
      
      <div style={{ border: '1px solid #ccc', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ background: '#f8f9fa', padding: 20, borderBottom: '1px solid #eee' }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>{prop.address} {prop.roomNumber}</h1>
          <span style={{ background: '#007bff', color: 'white', padding: '3px 8px', borderRadius: 4, fontSize: 12, marginRight: 5 }}>{prop.type}</span>
          <span style={{ color: '#666' }}>{prop.builtYear}년 준공</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* 왼쪽: 상세 정보 */}
          <div style={{ flex: 1, minWidth: 300, padding: 20, borderRight: '1px solid #eee' }}>
            <h3>💰 가격 정보</h3>
            <table style={{ width: '100%', marginBottom: 20 }}>
              <tbody>
                <tr><td>보증금/월세</td><td><strong>{prop.priceDeposit} / {prop.priceMonth}</strong> 만원</td></tr>
                <tr><td>매매가</td><td>{prop.priceSale ? `${prop.priceSale} 만원` : '-'}</td></tr>
                <tr><td>권리금</td><td>{prop.pricePremium ? `${prop.pricePremium} 만원` : '-'}</td></tr>
              </tbody>
            </table>

            <h3>🏠 건물 정보</h3>
            <p>면적: 공급 {prop.areaGeneral}평 / 전용 {prop.areaPrivate}평</p>
            <p>방 개수: {prop.rooms}개</p>
            <p>옵션: {prop.options || '없음'}</p>
            
            <div style={{ background: '#fff3cd', padding: 15, borderRadius: 8, marginTop: 20 }}>
              <h4 style={{ margin: '0 0 10px 0' }}>👤 세입자 및 주인 정보 (관리자용)</h4>
              <p>집주인: {prop.ownerPhone}</p>
              <p>세입자: {prop.tenantName} ({prop.tenantPhone})</p>
            </div>
          </div>

          {/* 오른쪽: 지도 및 미디어 */}
          <div style={{ flex: 1, minWidth: 300, padding: 20, background: '#fdfdfd' }}>
            <h3>🗺 위치 및 문서</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
               <button onClick={() => window.open(mapUrl, '_blank')} style={{...btnStyle, marginTop:0, background:'#fae100', color:'black'}}>📍 카카오맵 보기</button>
               {prop.contractLink && <button onClick={() => window.open(prop.contractLink, '_blank')} style={{...btnStyle, marginTop:0, background:'#28a745'}}>📄 계약서 보기</button>}
            </div>
            
            <div style={{ height: 300, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
               {prop.photoLink ? 
                 <img src={prop.photoLink} alt="매물 사진" style={{maxWidth:'100%', maxHeight:'100%'}} /> :
                 <span style={{color:'#999'}}>등록된 사진 없음</span>
               }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home({ user, onLogout }) {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // 상세 입력 폼 상태
  const [form, setForm] = useState({
    type: '원룸', address: '', roomNumber: '', builtYear: '', 
    areaGeneral: '', areaPrivate: '', rooms: 1,
    priceSale: '', priceDeposit: '', priceMonth: '', pricePremium: '',
    ownerPhone: '', tenantName: '', tenantPhone: '',
    options: [], photoLink: '', contractLink: ''
  });

  const optionList = ['에어컨','세탁기','냉장고','가스레인지','인덕션','전자레인지','침대','옷장','TV','책상'];

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async (query = '') => {
    const res = await axios.get(`${API_URL}/properties?search=${query}`);
    setProperties(res.data);
  };

  const handleSearch = () => {
    // "우리집" 검색 시 바로 이동
    if (search === '우리집') {
        if(properties.length > 0) navigate(`/detail/${properties[0].id}`);
        else alert('등록된 매물이 없습니다.');
        return;
    }
    fetchProperties(search);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${API_URL}/properties/${id}`, { headers: { 'x-user-role': user.role } });
      fetchProperties(search);
    } catch (err) {
      alert(err.response?.status === 403 ? '권한 부족: CEO만 삭제 가능' : '삭제 실패');
    }
  };

  // 체크박스 핸들러
  const handleOptionCheck = (opt) => {
    if (form.options.includes(opt)) {
      setForm({...form, options: form.options.filter(o => o !== opt)});
    } else {
      setForm({...form, options: [...form.options, opt]});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      // 배열인 options를 문자열로 변환하여 전송
      const payload = { ...form, options: form.options.join(',') };
      await axios.post(`${API_URL}/properties`, payload);
      alert('매물 등록 완료!');
      fetchProperties();
    } catch (e) { alert('등록 실패'); }
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, borderBottom: '1px solid #eee', paddingBottom: 15 }}>
        <div>
          <h2 style={{ margin: 0 }}>🏠 부동산 관리 시스템</h2>
          <span style={{ color: '#666' }}>접속자: <strong>{user.name}</strong> ({user.role === 'CEO' ? '대표' : '직원'})</span>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 15px', cursor: 'pointer' }}>로그아웃</button>
      </header>

      {/* 검색 */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        <input 
          placeholder="주소 또는 '우리집' 검색" 
          value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()}
          style={{ flex: 1, padding: 12, fontSize: 16, border: '1px solid #ccc', borderRadius: 5 }} 
        />
        <button onClick={handleSearch} style={{ padding: '0 20px', background: '#333', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>검색</button>
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        
        {/* 왼쪽: 매물 등록 폼 */}
        <div style={{ flex: 1, background: '#f9f9f9', padding: 20, borderRadius: 10, height: 'fit-content' }}>
          <h3 style={{ marginTop: 0 }}>📝 새 매물 기록</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10 }}>
            
            {/* 1. 매물 종류 체크 */}
            <div style={{ marginBottom: 10 }}>
              {['원룸','투룸','상가','사무실','토지','기타'].map(t => (
                <label key={t} style={{ marginRight: 10, cursor: 'pointer' }}>
                  <input type="radio" name="type" value={t} checked={form.type === t} onChange={handleChange} /> {t}
                </label>
              ))}
            </div>

            {/* 2. 주소 및 기본정보 */}
            <input name="address" placeholder="주소 (예: 노고산동 107-17)" value={form.address} onChange={handleChange} style={inputStyle} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input name="roomNumber" placeholder="호수 (예: 201호)" value={form.roomNumber} onChange={handleChange} style={inputStyle} />
              <input name="builtYear" placeholder="준공년도 (예: 2018)" type="number" value={form.builtYear} onChange={handleChange} style={inputStyle} />
            </div>

            {/* 3. 면적 및 방 개수 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <input name="areaGeneral" placeholder="공급평수" type="number" value={form.areaGeneral} onChange={handleChange} style={inputStyle} />
              <input name="areaPrivate" placeholder="전용평수" type="number" value={form.areaPrivate} onChange={handleChange} style={inputStyle} />
              <input name="rooms" placeholder="방 개수" type="number" value={form.rooms} onChange={handleChange} style={inputStyle} />
            </div>

            {/* 4. 가격 정보 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input name="priceSale" placeholder="매매가 (만원)" type="number" value={form.priceSale} onChange={handleChange} style={inputStyle} />
              <input name="pricePremium" placeholder="권리금 (만원)" type="number" value={form.pricePremium} onChange={handleChange} style={inputStyle} />
              <input name="priceDeposit" placeholder="보증금 (만원)" type="number" value={form.priceDeposit} onChange={handleChange} style={inputStyle} />
              <input name="priceMonth" placeholder="월세 (만원)" type="number" value={form.priceMonth} onChange={handleChange} style={inputStyle} />
            </div>

            {/* 5. 옵션 체크박스 */}
            <div style={{ background: 'white', padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
              <p style={{ margin: '0 0 5px 0', fontSize: 14, fontWeight: 'bold' }}>옵션 체크</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: 13 }}>
                {optionList.map(opt => (
                  <label key={opt} style={{ marginBottom: 5 }}>
                    <input type="checkbox" checked={form.options.includes(opt)} onChange={() => handleOptionCheck(opt)} /> {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* 6. 인적 사항 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input name="ownerPhone" placeholder="임대인 연락처" value={form.ownerPhone} onChange={handleChange} style={inputStyle} />
              <input name="tenantName" placeholder="세입자 성함" value={form.tenantName} onChange={handleChange} style={inputStyle} />
              <input name="tenantPhone" placeholder="세입자 연락처" value={form.tenantPhone} onChange={handleChange} style={inputStyle} />
            </div>

            {/* 7. 링크 */}
            <input name="photoLink" placeholder="사진 URL (구글 드라이브 등)" value={form.photoLink} onChange={handleChange} style={inputStyle} />
            <input name="contractLink" placeholder="계약서 링크" value={form.contractLink} onChange={handleChange} style={inputStyle} />

            <button type="submit" style={{...btnStyle, marginTop: 10}}>매물 저장하기</button>
          </form>
        </div>

        {/* 오른쪽: 매물 목록 */}
        <div style={{ flex: 1 }}>
          <h3>📋 등록된 매물 ({properties.length}건)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {properties.map(p => (
              <div key={p.id} onClick={() => navigate(`/detail/${p.id}`)} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8, cursor: 'pointer', background: 'white', position: 'relative', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>{p.address} {p.roomNumber}</h4>
                <div style={{ fontSize: 14, color: '#555' }}>
                  <span style={{ color: '#007bff', fontWeight: 'bold' }}>{p.type}</span> | {p.rooms}룸 | {p.areaPrivate}평
                </div>
                <div style={{ marginTop: 5, fontWeight: 'bold' }}>
                  {p.priceDeposit}/{p.priceMonth} {p.priceSale && `(매매 ${p.priceSale})`}
                </div>
                {user.role === 'CEO' && (
                  <button 
                    onClick={(e) => handleDelete(e, p.id)}
                    style={{ position: 'absolute', top: 15, right: 15, background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 4, cursor: 'pointer' }}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            {properties.length === 0 && <p style={{color:'#999'}}>검색 결과가 없습니다.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// 공통 스타일
const inputStyle = { width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 5, boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: 12, background: '#007bff', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer', fontWeight: 'bold' };

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={ !user ? <Login onLogin={setUser} /> : <Home user={user} onLogout={()=>setUser(null)} /> } />
        <Route path="/detail/:id" element={ !user ? <Login onLogin={setUser} /> : <PropertyDetail /> } />
      </Routes>
    </Router>
  );
}

export default App;