"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const hardcodedResponses = {
    "maharashtra": `Maharashtra Dabba Menu\nMonday – Poha, Chapati, Pithla, Bhakri, Koshimbir\nTuesday – Upma, Varan Bhaat, Batata Bhaji, Thecha\nWednesday – Thalipeeth, Bharli Vangi, Masoor Amti\nThursday – Misal Pav, Zunka Bhakri, Kanda Bhaji\nFriday – Sabudana Khichdi, Puran Poli, Matki Usal\nSaturday – Kanda Poha, Aluchi Patal Bhaji, Solkadhi\nSunday – Pav Bhaji, Ukdiche Modak, Masala Bhaat`,
    "what is the delhi state cook's menu for this week?": `Delhi Dabba Menu\nMonday – Aloo Paratha, Rajma Chawal, Boondi Raita\nTuesday – Chole Bhature, Paneer Butter Masala, Jeera Rice\nWednesday – Bedmi Puri, Aloo Subzi, Kachumber Salad\nThursday – Chana Kulcha, Bhindi Fry, Dal Tadka\nFriday – Methi Thepla, Aloo Gobhi, Masala Chaach\nSaturday – Soya Chaap, Baingan Bharta, Roti\nSunday – Pindi Chole, Amritsari Kulcha, Kheer`,
    "karnataka": `Karnataka Dabba Menu\nMonday – Thatte Idli, Bisi Bele Bath, Kosambari\nTuesday – Neer Dosa, Sagu, Rasam Rice\nWednesday – Ragi Mudde, Bassaru, Mangalore Buns\nThursday – Khara Bath, Mysore Masala Dosa, Coconut Chutney\nFriday – Set Dosa, Vegetable Kurma, Curd Rice\nSaturday – Maddur Vada, Tomato Bath, Puliyogare\nSunday – Rava Idli, Kharabath, Jolad Roti`,
    "tamil nadu": `Tamil Nadu Dabba Menu\nMonday – Pongal, Sambar, Coconut Chutney\nTuesday – Idiyappam, Kurma, Rasam Rice\nWednesday – Kothu Parotta, Kootu, Mor Kuzhambu\nThursday – Appam, Kadala Curry, Lemon Rice\nFriday – Rava Kesari, Kara Kuzhambu, Dosa\nSaturday – Medu Vada, Keerai Masiyal, Curd Rice\nSunday – Mini Tiffin (Idli, Dosa, Pongal, Vada)`,
    "gujarat": `Gujarat Dabba Menu\nMonday – Thepla, Sev Tameta, Khichdi Kadhi\nTuesday – Dhokla, Undhiyu, Bhakhri\nWednesday – Handvo, Ringna Bateta Nu Shaak, Dal Dhokli\nThursday – Khandvi, Patra, Rotla, Chaas\nFriday – Methi Thepla, Gujarati Kadhi, Suki Bhaji\nSaturday – Puran Poli, Kathiawadi Dal, Bajra Roti\nSunday – Fafda Jalebi, Aloo Shaak, Khakhra`,
    "telangana": `Telangana Dabba Menu\nMonday – Ragi Sangati, Natukodi Pulusu, Pappu\nTuesday – Pesarattu, Tomato Pappu, Chapati\nWednesday – Sakinalu, Bagara Baingan, Jonna Roti\nThursday – Punugulu, Majjiga Pulusu, Lemon Rice\nFriday – Sarva Pindi, Miryala Rasam, Curd Rice\nSaturday – Kodi Vepudu, Mudda Pappu, Roti\nSunday – Hyderabadi Dum Biryani, Shahi Tukda`,
    "west bengal": `West Bengal Dabba Menu\nMonday – Luchi, Aloo Dum, Cholar Dal\nTuesday – Shukto, Dal, Bhaja, Rice\nWednesday – Begun Bharta, Bhapa Ilish, Moong Dal\nThursday – Radha Ballavi, Chana Dal, Alu Phoolkopir Tarkari\nFriday – Chingri Malai Curry, Basanti Pulao\nSaturday – Macher Jhol, Alu Posto, Dal\nSunday – Kosha Mangsho, Luchi, Mishti Doi`,
    "uttar pradesh": `Uttar Pradesh Dabba Menu\nMonday – Poori, Aloo Sabzi, Boondi Raita\nTuesday – Chole Bhature, Kachumber Salad\nWednesday – Baati Chokha, Dal, Chutney\nThursday – Bedmi Puri, Aloo Sabzi, Jalebi\nFriday – Kachori, Matar Paneer, Tandoori Roti\nSaturday – Tehri, Boondi Raita, Achar\nSunday – Nihari, Sheermal, Kheer`,
    "rajasthan": `Rajasthan Dabba Menu\nMonday – Dal Baati Churma, Gatte ki Sabzi\nTuesday – Missi Roti, Ker Sangri, Bajra Khichdi\nWednesday – Pyaaz Kachori, Aloo Sabzi, Chaas\nThursday – Bajre ki Roti, Lahsun Chutney, Gatte Pulav\nFriday – Moong Dal Halwa, Kadhi, Methi Thepla\nSaturday – Ghewar, Panchmel Dal, Roti\nSunday – Rajasthani Thali, Malpua, Daal Bati`,
    "kerala": `Kerala Dabba Menu\nMonday – Puttu, Kadala Curry, Banana\nTuesday – Appam, Vegetable Stew, Coconut Chutney\nWednesday – Dosa, Sambar, Avial\nThursday – Idiyappam, Egg Curry, Pappadam\nFriday – Kerala Sadya, Payasam, Banana Chips\nSaturday – Fish Curry, Red Rice, Thoran\nSunday – Nadan Chicken Curry, Parotta, Rasam`,
    "maharashtrian cooks near me": "We have Ashok Kumar and he is 3.6km away and today he will be cooking Pithla Bhakri for Lunch"
};

const Chatbot = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "bot", content: "Hello! How can I assist you with Campus Dabba today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const lowerCaseInput = input.toLowerCase().trim();
    if (hardcodedResponses[lowerCaseInput]) {
      setMessages((prev) => [...prev, { role: "bot", content: hardcodedResponses[lowerCaseInput] }]);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }]
        })
      });
      const data = await response.json();

      let botResponse = "I'm having trouble understanding. Please try again.";
      if (data.candidates && data.candidates.length > 0) {
        botResponse = data.candidates[0]?.content?.parts?.map((part: any) => part.text).join("\n") || botResponse;
      }

      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Oops! Something went wrong. Please try again later." }]);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg h-[80vh] flex flex-col shadow-xl rounded-2xl bg-black/70 backdrop-blur-lg border border-gray-700 overflow-hidden"
      >
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`max-w-[75%] p-3 rounded-xl shadow-md text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-800 text-white"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
        </CardContent>
        <div className="p-4 flex items-center space-x-2 border-t bg-black/80 backdrop-blur-lg">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white"
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button onClick={sendMessage} className="rounded-full p-2 bg-blue-600 hover:bg-blue-700">
              <Send size={20} className="text-white" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
