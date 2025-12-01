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
    <div style={pageWrapperStyle}>
      <div style={{ ...cardStyle, maxWidth: '400px', padding: '40px' }}>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>🏢 부동산 매물 관리</h2>
        
        <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '30px' }}>
          <div onClick={() => setIsLoginMode(true)} style={{ flex: 1, padding: '15px', textAlign: 'center', cursor: 'pointer', fontWeight: isLoginMode ? 'bold' : 'normal', borderBottom: isLoginMode ? '3px solid #007bff' : 'none', color: isLoginMode ? '#007bff' : '#888', marginBottom: '-2px' }}>로그인</div>
          <div onClick={() => setIsLoginMode(false)} style={{ flex: 1, padding: '15px', textAlign: 'center', cursor: 'pointer', fontWeight: !isLoginMode ? 'bold' : 'normal', borderBottom: !isLoginMode ? '3px solid #007bff' : 'none', color: !isLoginMode ? '#007bff' : '#888', marginBottom: '-2px' }}>회원가입</div>
        </div>

        {/* ★ 여기 수정됨: 입력창 사이에 15px 간격 추가 */ }
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
        </div>

        <button onClick={isLoginMode ? handleLogin : handleRegister} style={{...btnStyle, marginTop: '25px'}}>
          {isLoginMode ? '로그인' : '회원가입 완료'}
        </button>
      </div>
    </div>
  );
}

function RegisterProperty({ user }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: '원룸', address: '', roomNumber: '', builtYear: '', 
    areaGeneral: '', areaPrivate: '', rooms: 1,
    priceSale: '', priceDeposit: '', priceMonth: '', pricePremium: '',
    ownerPhone: '', tenantName: '', tenantPhone: '',
    options: [], photoLink: '', contractLink: '', mapUrl: ''
  });

  const optionList = ['에어컨','세탁기','냉장고','가스레인지','인덕션','전자레인지','침대','옷장','TV','책상'];

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
  
  const handleOptionCheck = (opt) => {
    if (form.options.includes(opt)) setForm({...form, options: form.options.filter(o => o !== opt)});
    else setForm({...form, options: [...form.options, opt]});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const payload = { ...form, options: form.options.join(',') };
      await axios.post(`${API_URL}/properties`, payload);
      alert('매물 등록 완료!');
      navigate('/');
    } catch (e) { alert('등록 실패'); }
  };

  return (
    <div style={pageWrapperStyle}>
      <div style={{ ...cardStyle, maxWidth: '600px', padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#007bff' }}>📝 새 매물 등록</h3>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize:'16px' }}>✕ 닫기</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
          <div style={{ marginBottom: '10px', display:'flex', gap:'15px', flexWrap:'wrap', justifyContent:'center' }}>
            {['원룸','투룸','상가','사무실','토지','기타'].map(t => (
              <label key={t} style={{ cursor: 'pointer', fontSize:'14px' }}>
                <input type="radio" name="type" value={t} checked={form.type === t} onChange={handleChange} /> {t}
              </label>
            ))}
          </div>

          <input name="address" placeholder="주소 (필수 입력)" value={form.address} onChange={handleChange} style={inputStyle} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input name="roomNumber" placeholder="호수 (예: 201호)" value={form.roomNumber} onChange={handleChange} style={inputStyle} />
            <input name="builtYear" placeholder="준공년도" type="number" value={form.builtYear} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <input name="areaGeneral" placeholder="공급평" type="number" value={form.areaGeneral} onChange={handleChange} style={inputStyle} />
            <input name="areaPrivate" placeholder="전용평" type="number" value={form.areaPrivate} onChange={handleChange} style={inputStyle} />
            <input name="rooms" placeholder="방 수" type="number" value={form.rooms} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input name="priceSale" placeholder="매매가 (만원)" type="number" value={form.priceSale} onChange={handleChange} style={inputStyle} />
            <input name="pricePremium" placeholder="권리금 (만원)" type="number" value={form.pricePremium} onChange={handleChange} style={inputStyle} />
            <input name="priceDeposit" placeholder="보증금 (만원)" type="number" value={form.priceDeposit} onChange={handleChange} style={inputStyle} />
            <input name="priceMonth" placeholder="월세 (만원)" type="number" value={form.priceMonth} onChange={handleChange} style={inputStyle} />
          </div>
          <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', textAlign:'center' }}>옵션 선택</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap:'10px', fontSize: '13px' }}>
              {optionList.map(opt => (
                <label key={opt} style={{cursor:'pointer'}}><input type="checkbox" checked={form.options.includes(opt)} onChange={() => handleOptionCheck(opt)} /> {opt}</label>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <input name="ownerPhone" placeholder="임대인 연락처" value={form.ownerPhone} onChange={handleChange} style={inputStyle} />
            <input name="tenantName" placeholder="세입자 성함" value={form.tenantName} onChange={handleChange} style={inputStyle} />
            <input name="tenantPhone" placeholder="세입자 연락처" value={form.tenantPhone} onChange={handleChange} style={inputStyle} />
          </div>
          <input name="mapUrl" placeholder="지도 공유 링크 (선택)" value={form.mapUrl} onChange={handleChange} style={inputStyle} />
          <input name="photoLink" placeholder="사진 URL (이미지 주소)" value={form.photoLink} onChange={handleChange} style={inputStyle} />
          <input name="contractLink" placeholder="계약서 링크" value={form.contractLink} onChange={handleChange} style={inputStyle} />

          <button type="submit" style={{...btnStyle, marginTop: '10px', fontSize:'16px'}}>매물 저장하기</button>
        </form>
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

  if (!prop) return <div style={{padding:30, textAlign:'center'}}>⏳ 로딩중...</div>;

  const mapUrl = prop.mapUrl || `https://map.kakao.com/link/search/${prop.address}`;
  const handleImageError = (e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; };

  return (
    <div style={pageWrapperStyle}>
      <div style={{ ...cardStyle, maxWidth: '800px', padding: 0 }}>
        
        {/* 헤더 */}
        <div style={{ background: '#f8f9fa', padding: '30px', borderBottom: '1px solid #eee' }}>
          <button onClick={() => navigate(-1)} style={{ marginBottom: 15, padding: '5px 12px', cursor:'pointer', border:'1px solid #ccc', borderRadius:'6px', background:'white', fontSize:'13px' }}>← 목록으로</button>
          
          <h1 style={{ margin: '0 0 10px 0', fontSize: '26px' }}>{prop.address} {prop.roomNumber}</h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ background: '#007bff', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '14px', marginRight: '10px' }}>{prop.type}</span>
            <span style={{ color: '#666', fontSize:'15px' }}>{prop.builtYear}년 준공</span>
          </div>
        </div>

        {/* 상세 정보 */}
        <div style={{ padding: '30px' }}>
          
          <div style={{ background: '#f0f7ff', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e1ecf9' }}>
              <h3 style={{marginTop:0, color:'#0056b3', marginBottom: '15px'}}>💰 가격 정보</h3>
              <div style={{ fontSize:'16px', display:'flex', flexDirection:'column', gap:'8px' }}>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px dashed #cedae9', paddingBottom:'5px'}}>
                    <span style={{color:'#555'}}>보증금 / 월세</span>
                    <strong>{prop.priceDeposit} / {prop.priceMonth} 만원</strong>
                </div>
                <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px dashed #cedae9', paddingBottom:'5px'}}>
                    <span style={{color:'#555'}}>매매가</span>
                    <span>{prop.priceSale ? `${prop.priceSale} 만원` : '-'}</span>
                </div>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={{color:'#555'}}>권리금</span>
                    <span>{prop.pricePremium ? `${prop.pricePremium} 만원` : '-'}</span>
                </div>
              </div>
          </div>

          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '320px' }}>
              <h3 style={{marginTop:0, borderBottom:'2px solid #eee', paddingBottom:'10px'}}>🏠 건물 정보</h3>
              <ul style={{ listStyle: 'none', padding: 0, fontSize: '15px', lineHeight: '2' }}>
                <li><strong>면적:</strong> 공급 {prop.areaGeneral}평 / 전용 {prop.areaPrivate}평</li>
                <li><strong>방 개수:</strong> {prop.rooms}개</li>
                <li><strong>옵션:</strong> {prop.options || '없음'}</li>
              </ul>
              
              <div style={{ background: '#fff8e1', padding: '20px', borderRadius: '12px', marginTop: '20px', border:'1px solid #ffeeba' }}>
                <h4 style={{ margin: '0 0 10px 0', color:'#856404' }}>👤 관리자 전용</h4>
                <p style={{margin:'5px 0', fontSize:'14px'}}><strong>집주인:</strong> {prop.ownerPhone}</p>
                <p style={{margin:'5px 0', fontSize:'14px'}}><strong>세입자:</strong> {prop.tenantName} ({prop.tenantPhone})</p>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '320px' }}>
               <div style={{ height: '220px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', overflow:'hidden', marginBottom:'15px', border:'1px solid #eee' }}>
                 <img src={prop.photoLink} onError={handleImageError} alt="매물 사진" style={{width:'100%', height:'100%', objectFit:'cover'}} />
               </div>
               <div style={{ display: 'flex', gap: '10px' }}>
                 <button onClick={() => window.open(mapUrl, '_blank')} style={{...btnStyle, flex:1, background:'#fae100', color:'#3b1e1e', border:'none', fontSize:'14px'}}>📍 지도 보기</button>
                 {prop.contractLink && <button onClick={() => window.open(prop.contractLink, '_blank')} style={{...btnStyle, flex:1, background:'#28a745', border:'none', fontSize:'14px'}}>📄 계약서</button>}
               </div>
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

  useEffect(() => { fetchProperties(); }, []);

  const fetchProperties = async (query = '') => {
    const res = await axios.get(`${API_URL}/properties?search=${query}`);
    setProperties(res.data);
  };

  const handleSearch = () => {
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

  return (
    <div style={pageWrapperStyle}>
      <div style={{ ...cardStyle, maxWidth: '800px', background: 'transparent', boxShadow: 'none', padding: '0' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background:'white', padding:'20px', borderRadius:'16px', boxShadow:'0 4px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>🏠 부동산 관리 시스템</h2>
          <div style={{ display:'flex', alignItems:'center', gap:'10px'}}>
              <span style={{ color: '#666', fontSize:'14px' }}><strong>{user.name}</strong> 님</span>
              <button onClick={onLogout} style={{ padding: '6px 12px', cursor: 'pointer', border:'1px solid #ccc', background:'white', borderRadius:'6px' }}>로그아웃</button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input 
              placeholder="주소 또는 '우리집' 검색" 
              value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()}
              style={{ flex: 1, padding: '15px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '12px', paddingLeft:'20px', boxShadow:'0 2px 5px rgba(0,0,0,0.03)' }} 
            />
            <button onClick={handleSearch} style={{ padding: '0 25px', background: '#333', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize:'16px' }}>검색</button>
            <button onClick={() => navigate('/register')} style={{ padding: '0 25px', background: '#007bff', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize:'16px', fontWeight:'bold', minWidth:'120px' }}>+ 매물 등록</button>
        </div>

        <div>
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'15px'}}>
             <span style={{fontSize:'20px'}}>📋 등록된 매물</span>
             <span style={{background:'#eee', padding:'2px 8px', borderRadius:'10px', fontSize:'14px', fontWeight:'bold'}}>{properties.length}건</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {properties.map(p => (
              <div key={p.id} onClick={() => navigate(`/detail/${p.id}`)} style={{ border: '1px solid #fff', padding: '25px', borderRadius: '16px', cursor: 'pointer', background: 'white', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize:'20px', color:'#333' }}>{p.address} {p.roomNumber}</h4>
                  <span style={{ color: '#fff', fontWeight: 'bold', background: p.type==='원룸'?'#00C851':p.type==='투룸'?'#33b5e5':'#ffbb33', padding:'4px 10px', borderRadius:'20px', fontSize:'12px' }}>{p.type}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom:'12px', marginTop:'5px' }}>
                   {p.rooms}룸 · {p.areaPrivate}평 · {p.builtYear}년식
                </div>
                <div style={{ fontWeight: 'bold', fontSize:'18px', color:'#000' }}>
                  {p.priceDeposit}/{p.priceMonth} {p.priceSale && `(매매 ${p.priceSale})`}
                </div>
                {user.role === 'CEO' && (
                  <button 
                    onClick={(e) => handleDelete(e, p.id)}
                    style={{ position: 'absolute', top: '25px', right: '25px', background: '#ff4d4f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize:'13px' }}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            {properties.length === 0 && <p style={{color:'#999', textAlign:'center', padding:'40px', background:'white', borderRadius:'16px'}}>등록된 매물이 없습니다.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const pageWrapperStyle = {
  display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
  minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif',
  padding: '40px 20px', boxSizing: 'border-box',
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto'
};

const cardStyle = {
  width: '100%', padding: '40px', background: 'white', borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)', margin: 'auto 0',
  overflow: 'hidden'
};

const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box', fontSize:'14px' };
const btnStyle = { width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <Routes>
        <Route path="/" element={ !user ? <Login onLogin={setUser} /> : <Home user={user} onLogout={()=>setUser(null)} /> } />
        <Route path="/register" element={ !user ? <Login onLogin={setUser} /> : <RegisterProperty user={user} /> } />
        <Route path="/detail/:id" element={ !user ? <Login onLogin={setUser} /> : <PropertyDetail /> } />
      </Routes>
    </Router>
  );
}

export default App;