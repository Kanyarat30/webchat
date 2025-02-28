"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Menu, X, LogOut } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { text: "สวัสดี", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("tokenize"); // Default mode
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  
  const emojiMap = {
    "0": "😀",
    "1": "🥲",
    "2": "😡",
    "3": "😑",
    "4": "😨",
    "5": "😚",
    "6": "😉",
    "7": "🤨",
    "8": "😆",
    "9": "😍",
    "10": "😔",
    "11": "😙",
    "12": "😑",
    "13": "😳",
    "14": "😵",
    "15": "💔",
    "16": "😎",
    "17": "🥲",
    "18": "😆",
    "19": "😊",
    "20": "💜",
    "21": "👼",
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      let endpoint;
      if (mode === "tokenize") {
        endpoint = "tokenize";
      } else if (mode === "textqa") {
        endpoint = "textqa";
      } else if (mode === "en2th") {
        endpoint = "en2th";
      } else if (mode === "th2en") {
        endpoint = "th2en";
      } else if (mode === "th2zh") {
        endpoint = "th2zh";
      } else if (mode === "cleansing") {
        endpoint = "cleansing";
      } else if (mode === "zh2th") {
        endpoint = "zh2th";
      } else if (mode === "emoji") {
        endpoint = "emoji";
      } else if (mode === "similarity") {
        endpoint = "similarity";
      } else if (mode === "soundex") {
        endpoint = "soundex";
      } else if (mode === "emonews") {
        endpoint = "emonews";
      } else if (mode === "cyberbully") {
        endpoint = "cyberbully";
      }
      const response = await axios.post(`${API_URL}/${endpoint}`, {
        text: input,
      });
      console.log("API Response:", response.data);

      if (mode === "tokenize" && response.data.tokens && Array.isArray(response.data.tokens.result)) {
        setMessages((prev) => [...prev, { text: response.data.tokens.result.join(" "), sender: "bot" }]);
      } else if (mode === "textqa" && response.data.answer) {
        setMessages((prev) => [...prev, { text: response.data.answer, sender: "bot" }]);
      } else if (mode === "en2th" && response.data.translate && response.data.translate.translated_text) {
        setMessages((prev) => [...prev, { text: response.data.translate.translated_text, sender: "bot" }]);
      } else if (mode === "th2en" && response.data.translate && response.data.translate.translated_text) {
        setMessages((prev) => [...prev, { text: response.data.translate.translated_text, sender: "bot" }]);
      } else if (mode === "th2zh" && response.data.translate && response.data.translate.output) {
        setMessages((prev) => [...prev, { text: response.data.translate.output, sender: "bot" }]);
      } else if (mode === "cleansing" && response.data.cleansing && response.data.cleansing.cleansing_text) {
        console.log(response.data.cleansing.cleansing_text);
        setMessages((prev) => [...prev, { text: response.data.cleansing.cleansing_text, sender: "bot" }]);
      } else if (mode === "zh2th" && response.data.translate && response.data.translate.output) {
        setMessages((prev) => [...prev, { text: response.data.translate.output, sender: "bot" }]);
      } else if (mode === "emoji") {
        const emojiData = response.data.emoji;
        if (emojiData) {
          const maxEmojiKey = Object.keys(emojiData).reduce((a, b) =>
            parseFloat(emojiData[a]) > parseFloat(emojiData[b]) ? a : b
          );
          const emojiText = emojiMap[maxEmojiKey] || "❓";
          setMessages((prev) => [...prev, { text: emojiText, sender: "bot" }]);
        }
      } else if (mode === "similarity" && response.data.similarity && Array.isArray(response.data.similarity.words)) {
        response.data.similarity.words.forEach(item => {
          setMessages(prevMessages => [
            ...prevMessages,
            { text: `${item.word} (คะแนนคาดเดา: ${item.score.toFixed(2) * 100 + "%"})`, sender: "bot" },
          ]);
        });
      } else if (mode === "soundex" && response.data.soundex && Array.isArray(response.data.soundex.words)) {
        response.data.soundex.words.forEach(item => {
          setMessages(prevMessages => [
            ...prevMessages,
            { text: `${item.word}`, sender: "bot" }, //(distance: ${item.distance})
          ]);
        });
      } else if (mode === "emonews") {
        console.log("API Response:", response.data);
        if (response.data.emonews && response.data.emonews.result) {
            const emotions = response.data.emonews.result;
            const highestEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);
    
            // อัปเดตข้อความใน state
            setMessages(prevMessages => [
                ...prevMessages,
                { type: "emonews", text: `ตรวจพบอารมณ์: ${highestEmotion} (คะแนนคาดเดา: ${emotions[highestEmotion]*100+"%"})` }
            ]);
        } 
        else {
            setMessages(prevMessages => [
                ...prevMessages,
                { type: "error", text: "Unexpected response format" }
            ]);
        }
    } else if (mode === "cyberbully") {
      const { bully_type, bully_word, text } = response.data.cyberbully;
  console.log(bully_type, bully_word, text);
      if (bully_type == 0) {
          setMessages(prev => [...prev, {text: `คำว่า: ${text} ไม่พบการกลั่นแกล้ง`}]);
      } else {
          setMessages(prev => [...prev, {text: `คำว่า: ${text} ตรวจพบการกลั่นแกล้ง`}]);
      }
  }
  

      else {
        setMessages((prev) => [...prev, { text: "Unexpected API response format", sender: "bot" }]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setMessages((prev) => [...prev, { text: `Error: ${error.response?.data?.message || error.message}`, sender: "bot" }]);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    router.push('/');
  };

  const modeLabels = {
    "tokenize": "ตัดคำ",
    "textqa": "ถามตอบ",
    "en2th": "แปลเป็นไทย",
    "th2en": "แปลเป็นอังกฤษ",
    "th2zh": "แปลเป็นจีน",
    "cleansing": "ล้างอีโมจิ",
    "zh2th": "แปลจีนเป็นไทย",
    "emoji": "เดาอีโมจิจากข้อความ",
    "similarity": "เดาคำต่อ",
    "soundex": "เดาคำคล้าย",
    "emonews": "เดาอารมณ์จากอีโมจิ",
    "cyberbully": "ตรวจข้อความกลั่นแกล้ง",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-lg z-10 w-64`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-pink-600">Chat Bot</h2>
            <Button variant="ghost" size="sm" onClick={toggleSidebar} className="lg:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-4 space-y-2 flex-grow overflow-y-auto">
            <p className="text-sm text-gray-500 mb-2 font-medium">เลือกโหมด</p>
            {Object.entries(modeLabels).map(([key, label]) => (
              <Button 
                key={key}
                onClick={() => {
                  setMode(key);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full justify-start ${mode === key ? "bg-pink-600 hover:bg-pink-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="p-4 border-t">
            <p className="text-sm text-gray-500 mb-3">โหมดปัจจุบัน: <span className="font-medium text-pink-600">{modeLabels[mode]}</span></p>
            
            {/* ปุ่ม Logout */}
            <Button 
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center">
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="mr-2 lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800">{modeLabels[mode]}</h1>
        </div>

        {/* Chat area */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <Card
              key={index}
              className={`p-3 max-w-md ${msg.sender === "user" ? "ml-auto bg-pink-500 text-white" : "mr-auto bg-white"}`}
            >
              <CardContent>{msg.text}</CardContent>
            </Card>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <Input
              className="flex-grow mr-2 border-2 border-pink-300 rounded-lg p-2"
              placeholder="พิมพ์ข้อความ..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}