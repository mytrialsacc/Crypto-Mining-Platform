import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { usePlanStore } from './planStore';

interface MiningSession {
  id: string;
  coin_type: string;
  is_mining: boolean;
  user_id: string;
  start_time: string;
  last_pause_time?: string;
  earnings: number;
}

interface MiningState {
  activeMining: MiningSession | null;
  totalEarnings: number;
  currentRate: number;
  setActiveMining: (mining: MiningSession | null) => void;
  startMining: (coinType: string) => Promise<void>;
  stopMining: () => Promise<void>;
  fetchTotalEarnings: () => Promise<void>;
  updateCurrentRate: () => void;
}

export const useMiningStore = create<MiningState>((set, get) => ({
  activeMining: null,
  totalEarnings: 0,
  currentRate: usePlanStore.getState().currentPlan?.rate || 0.00000100,
  setActiveMining: (mining) => set({ activeMining: mining }),
  updateCurrentRate: () => {
    const activeMining = get().activeMining;
    if (!activeMining) {
      set({ currentRate: usePlanStore.getState().currentPlan?.rate || 0.00000100 });
      return;
    }

    const startTime = new Date(activeMining.start_time).getTime();
    const currentTime = new Date().getTime();
    const hoursElapsed = (currentTime - startTime) / (60 * 60 * 1000);
    const completedSixHourCycles = Math.floor(hoursElapsed / 6);
    const baseRate = usePlanStore.getState().currentPlan?.rate || 0.00000100;
    const newRate = baseRate * (completedSixHourCycles + 1);
    set({ currentRate: newRate });
  },
  fetchTotalEarnings: async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from('user_balances')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      set({ totalEarnings: data.balance });
    }
  },
  startMining: async (coinType) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const baseRate = usePlanStore.getState().currentPlan?.rate || 0.00000100;

    const { data, error } = await supabase
      .from('mining_sessions')
      .insert([
        {
          coin_type: coinType,
          is_mining: true,
          user_id: user.id,
          earnings: 0
        },
      ])
      .select()
      .single();

    if (error) throw error;
    set({ activeMining: data, currentRate: baseRate });

    // Start rate update interval
    const updateInterval = setInterval(() => {
      get().updateCurrentRate();
    }, 60 * 1000); // Update every minute

    // Function to calculate and add earnings
    const addEarnings = async () => {
      const currentMining = get().activeMining;
      if (!currentMining || !currentMining.is_mining) {
        clearInterval(updateInterval);
        return;
      }

      // Add base rate earnings based on plan
      const { error: updateError } = await supabase
        .from('mining_sessions')
        .update({ 
          earnings: baseRate
        })
        .eq('id', data.id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating earnings:', updateError);
        return;
      }

      get().fetchTotalEarnings();

      // Schedule next earnings update
      setTimeout(addEarnings, 6 * 60 * 60 * 1000);
    };

    // Start the first earnings cycle
    setTimeout(addEarnings, 6 * 60 * 60 * 1000);
  },
  stopMining: async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const currentMining = get().activeMining;
    if (!currentMining) return;

    const baseRate = usePlanStore.getState().currentPlan?.rate || 0.00000100;

    // Calculate earnings based on completed 6-hour cycles
    const startTime = new Date(currentMining.start_time).getTime();
    const currentTime = new Date().getTime();
    const hoursElapsed = (currentTime - startTime) / (60 * 60 * 1000);
    const completedSixHourCycles = Math.floor(hoursElapsed / 6);
    const earnings = completedSixHourCycles > 0 ? baseRate * completedSixHourCycles : 0;

    const { error } = await supabase
      .from('mining_sessions')
      .update({ 
        is_mining: false, 
        last_pause_time: new Date().toISOString(),
        earnings: earnings
      })
      .eq('id', currentMining.id)
      .eq('user_id', user.id);

    if (error) throw error;
    set({ activeMining: null, currentRate: baseRate });
    get().fetchTotalEarnings();
  },
}));