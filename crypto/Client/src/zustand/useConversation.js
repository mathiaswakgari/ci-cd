// zustand/useConversation.js
import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
   setMessages: (update) =>
    set((state) => ({
      messages: typeof update === "function" ? update(state.messages) : update,
    })),
  privateKey: null, 
  setPrivateKey: (privateKey) => set({ privateKey }), 
  setPublicKey: (publicKey) => set({ publicKey }), 
}));

export default useConversation;
