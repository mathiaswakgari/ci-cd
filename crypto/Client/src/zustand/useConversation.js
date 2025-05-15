// zustand/useConversation.js
import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  privateKey: null, // Add this
  setPrivateKey: (privateKey) => set({ privateKey }), // And this
  setPublicKey: (publicKey) => set({ publicKey }), // Add this
}));

export default useConversation;
