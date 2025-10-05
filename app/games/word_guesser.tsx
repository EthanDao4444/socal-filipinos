"use client";

import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';

type WordItem = {
  word: string;
  options: string[];
  correct: string;
  explanation: string;
  example: string;
  pronunciation?: string;
};

//can add better terms 

const WORD_BANK: WordItem[] = [
{ word: "Bayanihan", pronunciation: "bah-ya-nee-hahn", options: ["A type of folk dance","Communal spirit of helping one another","A traditional house","National anthem"], correct: "Communal spirit of helping one another", explanation: "Represents neighbors helping one another as a community act.", example: "The villagers practiced bayanihan to move the old house." },
  { word: "Kilig", pronunciation: "kee-lig", options: ["A feeling of romantic excitement or butterflies","A type of snack","To be angry","A seaside village"], correct: "A feeling of romantic excitement or butterflies", explanation: "A fluttery, excited feeling in romantic or cute situations.", example: "She felt kilig when he gave her flowers." },
  { word: "Pasalubong", pronunciation: "pah-sah-loo-bong", options: ["A farewell song","A home-cooked meal","A gift brought home from a trip","An evening prayer"], correct: "A gift brought home from a trip", explanation: "Gifts or souvenirs brought home by travelers for friends or family.", example: "He brought pasalubong for his siblings from Manila." },
  { word: "Tampo", pronunciation: "tahm-poh", options: ["A playful teasing","A mild sulk or hurt feeling","A festival","A form of folk weaving"], correct: "A mild sulk or hurt feeling", explanation: "A quiet upset when one feels slighted.", example: "She showed tampo after he forgot their anniversary." },
  { word: "Halo-halo", pronunciation: "hah-loh hah-loh", options: ["A traditional sung lullaby","A mixed Filipino cold dessert with shaved ice","A type of boat","A summer festival"], correct: "A mixed Filipino cold dessert with shaved ice", explanation: "A cold dessert with shaved ice, milk, sweet beans, fruits, and other toppings.", example: "We enjoyed halo-halo at the summer festival." },
  { word: "Barkada", pronunciation: "bar-kah-dah", options: ["A type of footwear","A close group of friends","A market","A traditional hat"], correct: "A close group of friends", explanation: "A social circle of close friends.", example: "He went to the movies with his barkada." },
  { word: "Utang na loob", pronunciation: "oo-tahng nah loh-ohb", options: ["A financial loan","An unpayable debt","Debt of gratitude / moral obligation","A legal contract"], correct: "Debt of gratitude / moral obligation", explanation: "A sense of moral obligation to someone who helped you.", example: "She felt utang na loob to her teacher for the guidance." },
  { word: "Pasensya", pronunciation: "pah-sen-shah", options: ["A celebratory dance","Patience / excuse me","A type of food","A small gift"], correct: "Patience / excuse me", explanation: "Polite expression asking for patience or understanding.", example: "Pasensya, I was late because of traffic." },
  { word: "Mano", pronunciation: "mah-noh", options: ["A traditional handshake","A gesture of respect where one takes an elder's hand to the forehead","A cooking method","A child's game"], correct: "A gesture of respect where one takes an elder's hand to the forehead", explanation: "A respectful gesture to elders performed by taking their hand and touching it to the forehead.", example: "The child did a mano to greet his grandmother." },
  { word: "Sari-sari", pronunciation: "sah-ree sah-ree", options: ["A type of song","A small neighborhood store","A weaving pattern","A cooking utensil"], correct: "A small neighborhood store", explanation: "Small, family-run convenience shop selling everyday goods.", example: "She bought snacks at the local sari-sari store." },
  { word: "Balikbayan", pronunciation: "bah-leek-bah-yahn", options: ["A travel visa","A Filipino living abroad returning home with gifts","A kind of boat","A community elder"], correct: "A Filipino living abroad returning home with gifts", explanation: "A Filipino who returns home from abroad, often bringing gifts.", example: "The balikbayan arrived with a box of goodies." },
  { word: "Simbang Gabi", pronunciation: "seem-bahng gah-bee", options: ["A daytime market","A nine-day series of dawn masses before Christmas","A type of kite","A harvest festival"], correct: "A nine-day series of dawn masses before Christmas", explanation: "Early morning masses before Christmas, a Filipino Catholic tradition.", example: "They attended Simbang Gabi every morning of December." },
  { word: "Jeepney", pronunciation: "jeep-nee", options: ["A children's toy","An iconic Filipino public transport vehicle","A musical instrument","A traditional costume"], correct: "An iconic Filipino public transport vehicle", explanation: "Colorful repurposed jeeps used for public transportation.", example: "We rode a jeepney to get to the city center." },
  { word: "Sinigang", pronunciation: "see-nee-gahng", options: ["A sour tamarind-based Filipino soup","A celebratory song","A woven cloth","A poetic form"], correct: "A sour tamarind-based Filipino soup", explanation: "A Filipino soup known for its sour tamarind-flavored broth.", example: "Mom cooked sinigang for dinner with pork and vegetables." },
  { word: "Pamamanhikan", pronunciation: "pah-mah-mahn-hee-kahn", options: ["A marriage proposal tradition where the groom's family visits the bride's family","A type of boat race","A harvest ritual","A cooking technique"], correct: "A marriage proposal tradition where the groom's family visits the bride's family", explanation: "Formal visit by groom's family to the bride's family to discuss marriage plans.", example: "During pamamanhikan, they planned the wedding details." },
  { word: "Pasintabi", pronunciation: "pah-sin-tah-bee", options: ["A spoken apology or polite notice before saying something sensitive","A type of bread","A festival game","A measurement unit"], correct: "A spoken apology or polite notice before saying something sensitive", explanation: "Polite warning or notice before discussing sensitive topics.", example: "Pasintabi, I have some bad news to share." },
  { word: "Lakbay", pronunciation: "lahk-bye", options: ["A dance","A journey or travel","A form of greeting","A decorative cloth"], correct: "A journey or travel", explanation: "Means travel or journey, often used for exploration.", example: "They planned a lakbay to the northern mountains." },
  { word: "Merienda", pronunciation: "meh-ree-en-dah", options: ["A main course meal","A light snack or afternoon tea","A religious chant","A traditional house"], correct: "A light snack or afternoon tea", explanation: "A light snack eaten between meals, commonly in the afternoon.", example: "We had merienda of rice cakes and tea." },
  { word: "Bahala na", pronunciation: "bah-hah-lah nah", options: ["An expression of giving up","An expression of leaving things to fate or trust in a higher power","A greeting","A type of work"], correct: "An expression of leaving things to fate or trust in a higher power", explanation: "Expression conveying trust in fate or resignation.", example: "I forgot my homework, but bahala na." }
  
];

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//can run indefinitely
function drawRunDeck(bank: WordItem[]) {
  return shuffle(bank);
}

export default function Page() {
  const [deck, setDeck] = useState<WordItem[]>(() => drawRunDeck(WORD_BANK));
  const [index, setIndex] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  useEffect(() => {
    const current = deck[index];
    setShuffledOptions(current ? shuffle(current.options) : []);
    setSelected(null);
    setShowExplanation(false);
  }, [deck, index]);

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === deck[index].correct;
    if (isCorrect) setCorrectCount(c => c + 1);
    setShowExplanation(true);
  }

  function handleNext() {
    const next = index + 1;
    // If reached end of the deck, reshuffle word bank and start at 0.
    if (next >= deck.length) {
      const newDeck = drawRunDeck(WORD_BANK);
      setDeck(newDeck);
      setIndex(0);
    } else {
      setIndex(next);
    }
  }

  function startNewRun() {
    const newDeck = drawRunDeck(WORD_BANK);
    setDeck(newDeck);
    setIndex(0);
    setCorrectCount(0);
    setSelected(null);
    setShowExplanation(false);
  }

  const current = deck[index];

  return (
    <View style={{ flex: 1 }} className="bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="max-w-xl mx-auto p-4">
          <View className="mb-6">
            <View className="bg-indigo-50 rounded-xl p-4 items-center">
              <Text className="text-3xl font-extrabold text-indigo-700">Word Guesser</Text>
              <Text className="text-sm text-indigo-600 mt-1">Guess Filipino words & meanings</Text>
            </View>
          </View>

          {deck.length === 0 ? (
            <View className="text-center py-8">
              <Text className="text-lg">No words available.</Text>
              <Text className="text-sm text-gray-500">Please add words to the word bank or check your configuration.</Text>
            </View>
          ) : current ? (
            <View>
              <View className="mb-6 bg-white p-4 rounded-xl shadow-md">
                <Text className="text-4xl font-extrabold text-gray-900 text-center">{current.word}</Text>
                {current.pronunciation ? <Text className="text-sm text-gray-500 text-center mt-1">/{current.pronunciation}/</Text> : null}
                <Text className="mt-3 text-gray-700 text-center">{current.example}</Text>
              </View>

              <View className="mb-6">
                {shuffledOptions.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = option === current.correct;
                  const baseClass = 'px-4 py-4 rounded-lg mb-3';
                  const colorClass = isSelected
                    ? isCorrect
                      ? 'bg-green-100 border border-green-300'
                      : 'bg-red-100 border border-red-300'
                    : 'bg-white border border-gray-200 shadow-sm';

                  return (
                    <Pressable
                      key={option}
                      onPress={() => handleSelect(option)}
                      disabled={!!selected}
                      className={`${baseClass} ${colorClass}`}
                      accessibilityState={{ selected: isSelected, disabled: !!selected }}
                    >
                      <Text className="text-base">{option}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* /so next button doesn't move when explanation appears */}
              <View style={{ minHeight: 80 }} className="mb-2">
                {showExplanation && selected ? (
                  <View className="mb-4 p-3 bg-gray-50 rounded border">
                    <Text className="font-semibold">{selected === current.correct ? 'Correct!' : 'Not quite!'}</Text>
                    <Text className="text-sm text-gray-700 mt-1">{current.explanation}</Text>
                  </View>
                ) : null}
              </View>

            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* to prevent layout shifts*/}
      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: 'transparent' }}>
        <View className="max-w-xl mx-auto">
          <View className="items-center mb-3">
            <View className="px-3 py-1 bg-indigo-100 rounded-full">
              <Text className="text-indigo-700 font-medium">Correct: {correctCount}</Text>
            </View>
          </View>

          <Pressable
            onPress={handleNext}
            disabled={!showExplanation}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityState={{ disabled: !showExplanation }}
            android_ripple={{ color: 'rgba(255,255,255,0.15)' }}
            className={`w-full items-center ${!showExplanation ? 'bg-gray-300' : 'bg-indigo-600'} px-6 py-4 rounded-full shadow-lg`}
          >
            <Text className="text-white text-xl font-bold">Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}