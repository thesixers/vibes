import React from "react";
import { RotateCw } from "lucide-react";
import { useSync } from "../context/SyncContext";
import { motion, AnimatePresence } from "framer-motion";

const SyncUI = () => {
  const { syncing } = useSync();

  return (
    <AnimatePresence>
      {syncing && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          // Centered at the top, sleek black pill
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/80 text-white backdrop-blur-md shadow-2xl border border-white/10"
        >
          <RotateCw className="animate-spin text-primary" size={18} />
          <span className="text-sm font-bold tracking-wide">
            Syncing Library...
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SyncUI;
