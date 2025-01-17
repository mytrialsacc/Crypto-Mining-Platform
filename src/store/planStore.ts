import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Plan {
  id: string;
  name: string;
  rate: number;
  price: number;
  description: string;
}

interface PlanState {
  currentPlan: Plan | null;
  setCurrentPlan: (plan: Plan | null) => void;
  fetchCurrentPlan: () => Promise<void>;
  purchasePlan: (planId: string) => Promise<void>;
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    rate: 0.00000100,
    price: 0,
    description: 'Start mining with basic rate'
  },
  {
    id: 'bronze',
    name: 'Bronze Plan',
    rate: 0.00000300,
    price: 10,
    description: '3x faster mining rate'
  },
  {
    id: 'gold',
    name: 'Gold Plan',
    rate: 0.00000400,
    price: 20,
    description: '4x faster mining rate'
  },
  {
    id: 'platinum',
    name: 'Platinum Plan',
    rate: 0.00000600,
    price: 30,
    description: '6x faster mining rate'
  },
  {
    id: 'diamond',
    name: 'Diamond Plan',
    rate: 0.00000800,
    price: 40,
    description: '8x faster mining rate'
  },
  {
    id: 'elite',
    name: 'Elite Plan',
    rate: 0.00001000,
    price: 50,
    description: '10x faster mining rate'
  }
];

export const usePlanStore = create<PlanState>((set) => ({
  currentPlan: PLANS[0], // Default to free plan
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  fetchCurrentPlan: async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const { data, error } = await supabase
      .from('user_plans')
      .select('plan_id')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      const plan = PLANS.find(p => p.id === data.plan_id) || PLANS[0];
      set({ currentPlan: plan });
    } else {
      set({ currentPlan: PLANS[0] });
    }
  },
  purchasePlan: async (planId) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_plans')
      .upsert({
        user_id: user.id,
        plan_id: planId,
        purchased_at: new Date().toISOString()
      });

    if (error) throw error;

    const plan = PLANS.find(p => p.id === planId);
    set({ currentPlan: plan || PLANS[0] });
  }
}));