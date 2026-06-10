"use client";

import { useState, useCallback } from "react";
import { INITIAL_CATEGORIES, Category, MenuItem } from "@/data/menuData";

export type VoteState = {
  [menuId: string]: number; // menuId -> vote count
};

export function useVote() {
  const [categories, setCategories] =
    useState<Category[]>(INITIAL_CATEGORIES);
  const [votes, setVotes] = useState<VoteState>({});
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const vote = useCallback(
    (menuId: string) => {
      if (finalResult) return;
      const isVoted = myVotes.has(menuId);
      if (isVoted) {
        setMyVotes((prev) => {
          const next = new Set(prev);
          next.delete(menuId);
          return next;
        });
        setVotes((v) => ({
          ...v,
          [menuId]: Math.max(0, (v[menuId] || 0) - 1),
        }));
      } else {
        setMyVotes((prev) => new Set(prev).add(menuId));
        setVotes((v) => ({ ...v, [menuId]: (v[menuId] || 0) + 1 }));
      }
    },
    [finalResult, myVotes]
  );

  const addCustomItem = useCallback(
    (categoryId: string, itemName: string) => {
      if (!itemName.trim()) return;
      const newItem: MenuItem = {
        id: `custom-${categoryId}-${Date.now()}`,
        name: itemName.trim(),
        custom: true,
      };
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: [...cat.items, newItem] }
            : cat
        )
      );
    },
    []
  );

  const getTotalVotes = useCallback(() => {
    return Object.values(votes).reduce((sum, v) => sum + v, 0);
  }, [votes]);

  const getTopMenuItem = useCallback((): {
    menuId: string;
    name: string;
    count: number;
    categoryId: string;
  } | null => {
    let maxCount = 0;
    let topMenuId = "";
    Object.entries(votes).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topMenuId = id;
      }
    });
    if (!topMenuId || maxCount === 0) return null;
    for (const cat of categories) {
      const item = cat.items.find((i) => i.id === topMenuId);
      if (item)
        return {
          menuId: topMenuId,
          name: item.name,
          count: maxCount,
          categoryId: cat.id,
        };
    }
    return null;
  }, [votes, categories]);

  const getCategoryVoteSummary = useCallback(() => {
    return categories.map((cat) => {
      const total = cat.items.reduce(
        (sum, item) => sum + (votes[item.id] || 0),
        0
      );
      return { categoryId: cat.id, name: cat.name, emoji: cat.emoji, total, color: cat.color };
    });
  }, [categories, votes]);

  const finalizeVote = useCallback(() => {
    const top = getTopMenuItem();
    if (!top) return;
    setFinalResult(top.menuId);
    setShowResult(true);
  }, [getTopMenuItem]);

  const resetVote = useCallback(() => {
    setVotes({});
    setMyVotes(new Set());
    setFinalResult(null);
    setShowResult(false);
  }, []);

  return {
    categories,
    votes,
    myVotes,
    finalResult,
    showResult,
    setShowResult,
    vote,
    addCustomItem,
    getTotalVotes,
    getTopMenuItem,
    getCategoryVoteSummary,
    finalizeVote,
    resetVote,
  };
}
