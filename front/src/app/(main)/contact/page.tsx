"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    type: '',
    phone: '',
    email: '',
    position: '',
    message: '',
    identity: '',
  });
  const [charCount, setCharCount] = useState(0);
  const [contactMethod, setContactMethod] = useState('email');
  const [submitMsg, setSubmitMsg] = useState('');
  const [error, setError] = useState('');
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
  });

  function formatPhone(value: string) {
    const onlyNums = value.replace(/[^0-9]/g, '');
    if (onlyNums.length < 4) return onlyNums;
    if (onlyNums.length < 8) return onlyNums.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    return onlyNums.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const prev = formData.phone;
    if (raw.length < prev.length && prev[raw.length] === '-') {
      setFormData({ ...formData, phone: prev.slice(0, -1) });
      return;
    }
    setFormData({ ...formData, phone: formatPhone(raw) });
  }

  function isValidEmail(email: string) {
    return /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(formData.email)) {
      setError('이메일 형식이 올바르지 않습니다.');
      return;
    }
    if (formData.name.length > 10 || formData.company.length > 10) {
      setError('이름과 회사명은 10글자 이내로 입력해 주세요.');
      return;
    }
    try {
      await api.post('/user/contact', { ...formData, phone: formData.phone });
      setSubmitMsg('문의가 정상적으로 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
      setFormData({
        name: '',
        company: '',
        type: '',
        phone: '',
        email: '',
        position: '',
        message: '',
        identity: '',
      });
      setCharCount(0);
    } catch (err) {
      setSubmitMsg('문의 접수에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'contactMethod') {
      setContactMethod(value);
      return;
    }
    if (name === 'message') {
      if (value.length > 100) return;
      setCharCount(value.length);
    }
    if (name === 'phone') {
      handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
      return;
    }
    if (name === 'name' || name === 'company') {
      setFormData(prev => ({
        ...prev,
        [name]: value.replace(/[^\w가-힣]/g, '').slice(0, 10)
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <main className="mt-[110px] min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold text-center mb-4 text-blue-700">Contact Us</h1>
          <p className="text-center text-gray-500 mb-10">궁금한 점이나 제안이 있으시면 아래 양식을 작성해 주세요.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="identity" className="block text-sm font-medium text-gray-700 mb-1">구분</label>
                <select
                  id="identity"
                  name="identity"
                  value={formData.identity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="company">회사</option>
                  <option value="person">개인</option>
                </select>
              </div>
              <div className="w-1/2">
                <label htmlFor={formData.identity === 'company' ? 'company' : 'name'} className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.identity === 'company' ? '회사명' : '이름'}
                </label>
                <input
                  type="text"
                  id={formData.identity === 'company' ? 'company' : 'name'}
                  name={formData.identity === 'company' ? 'company' : 'name'}
                  value={formData.identity === 'company' ? formData.company : formData.name}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  placeholder={formData.identity === 'company' ? '회사명을 입력하세요' : '이름을 입력하세요'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="text-xs text-gray-400 text-right">{(formData.identity === 'company' ? formData.company.length : formData.name.length)}/10</div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">직책</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  inputMode="numeric"
                  pattern="[0-9-]*"
                  maxLength={13}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              </div>
              <div className="w-1/2">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">문의 유형</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="비즈니스 제안">비즈니스 제안</option>
                  <option value="협업 제안">협업 제안</option>
                  <option value="기타 문의">기타 문의</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  문의 내용 <span className="text-gray-400 text-xs">(최대 100자)</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                maxLength={100}
                placeholder="간단한 용건을 100자 이내로 작성해 주세요."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{charCount}/100자</div>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">연락받고 싶은 방법</span>
              <div className="flex gap-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="email"
                    checked={contactMethod === 'email'}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="ml-2">이메일</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="phone"
                    checked={contactMethod === 'phone'}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="ml-2">전화</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="sms"
                    checked={contactMethod === 'sms'}
                    onChange={handleChange}
                    className="accent-blue-600"
                  />
                  <span className="ml-2">문자</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold shadow-md"
            >
              문의하기
            </button>
            <div className="text-center text-gray-400 text-sm mt-6">
              작성해주신 연락처로 추후 연락드릴 예정입니다.
            </div>
          </form>
          {submitMsg && (
            <div className="mt-6 text-center text-blue-600 font-semibold">{submitMsg}</div>
          )}
        </div>
      </div>
    </main>
  );
}