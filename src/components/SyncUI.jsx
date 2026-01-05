import { RotateCw } from "lucide-react";
import { useSync } from "../context/SyncContext";

const SyncUI = () => {
    const { syncing } = useSync();
    if (!syncing) return null;
    return (
        <div className="fixed top-[50px] right-[20px] z-50 flex items-center justify-center">
            <div className="bg-black/10 p-4 rounded-lg shadow-lg flex items-center gap-2">
                <RotateCw className="animate-spin" size={24} />
                <p className="text-white/50 text-sm font-semibold text-center w-full">Syncing your library</p>
            </div>
        </div>
    );
};

export default SyncUI;
