import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "@react-navigation/native";
import {
  Plus,
  Trash2,
  ChevronRight,
  X,
  Dumbbell,
} from "lucide-react-native";

interface Plan {
  id: number;
  name: string;
  description: string;
  exercise_count: number;
  order_index: number;
}

export default function PlansScreen({ navigation }: any) {
  const db = useSQLiteContext();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDesc, setNewPlanDesc] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadPlans = async () => {
    const loaded = await db.getAllAsync<Plan>(`
      SELECT p.id, p.name, p.description, p.order_index,
        COUNT(wpe.id) as exercise_count
      FROM workout_plans p
      LEFT JOIN workout_plan_exercises wpe ON wpe.workout_plan_id = p.id
      GROUP BY p.id
      ORDER BY p.order_index ASC, p.id DESC
    `);
    setPlans(loaded);
  };

  useFocusEffect(
    useCallback(() => {
      loadPlans();
    }, []),
  );

  const closeAddDialog = () => {
    if (isSaving) return;
    setIsAdding(false);
    setNewPlanName("");
    setNewPlanDesc("");
  };

  const handleAddPlan = async () => {
    const name = newPlanName.trim();
    if (!name) {
      Alert.alert("Plan name required", "Enter a name for your workout plan.");
      return;
    }

    try {
      setIsSaving(true);
      await db.runAsync(
        "INSERT INTO workout_plans (name, description, order_index) VALUES (?, ?, ?)",
        [name, newPlanDesc.trim(), plans.length],
      );
      setNewPlanName("");
      setNewPlanDesc("");
      setIsAdding(false);
      await loadPlans();
    } catch (error) {
      Alert.alert("Couldn't create plan", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert("Delete Plan", `Delete "${name}"? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.runAsync("DELETE FROM workout_plans WHERE id = ?", [id]);
          loadPlans();
        },
      },
    ]);
  };

  const onDragEnd = async ({ data }: { data: Plan[] }) => {
    setPlans(data);
    for (let i = 0; i < data.length; i++) {
      await db.runAsync(
        "UPDATE workout_plans SET order_index = ? WHERE id = ?",
        [i, data[i].id],
      );
    }
  };

  return (
    <View className="flex-1 bg-background p-4 pt-10">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-3xl font-bold text-on-surface">
            Workout Plans
          </Text>
          <Text className="text-on-variant text-base mt-1">
            Build a routine that works for you
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Add workout plan"
          className="bg-primary w-12 h-12 rounded-full items-center justify-center"
          onPress={() => setIsAdding(true)}
          activeOpacity={0.8}
        >
          <Plus color="#3d2e00" size={25} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <DraggableFlatList
        data={plans}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={onDragEnd}
        contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
        ListEmptyComponent={
          <View className="items-center py-16 px-6">
            <View className="w-16 h-16 rounded-full bg-surface-container items-center justify-center mb-4">
              <Dumbbell color="#f2ca50" size={30} />
            </View>
            <Text className="text-on-surface text-lg font-bold text-center mb-2">
              No workout plans yet
            </Text>
            <Text className="text-on-variant text-base text-center leading-6">
              Create your first plan to start organizing your workouts.
            </Text>
            <TouchableOpacity
              onPress={() => setIsAdding(true)}
              className="bg-primary rounded-xl px-5 py-3 mt-5"
              activeOpacity={0.8}
            >
              <Text className="text-on-primary font-bold text-base">
                Create a plan
              </Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, drag, isActive }: RenderItemParams<Plan>) => (
          <ScaleDecorator>
            <TouchableOpacity
              className={`bg-surface-container rounded-xl p-4 mb-3 border border-surface-bright flex-row items-center ${isActive ? "border-primary" : ""}`}
              onPress={() =>
                navigation.navigate("PlanDetail", {
                  planId: item.id,
                  planName: item.name,
                })
              }
              onLongPress={drag}
              delayLongPress={200}
              activeOpacity={0.7}
            >
              <View className="w-1 rounded-full bg-primary mr-3 self-stretch" />
              <View className="flex-1">
                <Text className="text-on-surface font-bold text-xl">
                  {item.name}
                </Text>
                {item.description ? (
                  <Text className="text-on-variant mt-1 text-base leading-5">
                    {item.description}
                  </Text>
                ) : null}
                <Text className="text-primary text-sm font-bold mt-2 uppercase tracking-wider">
                  {item.exercise_count} exercise
                  {item.exercise_count !== 1 ? "s" : ""}
                </Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.name}`}
                  onPress={() => handleDelete(item.id, item.name)}
                  className="p-2 mr-1"
                >
                  <Trash2 color="#8b8985" size={20} />
                </TouchableOpacity>
                <ChevronRight color="#8b8985" size={22} />
              </View>
            </TouchableOpacity>
          </ScaleDecorator>
        )}
      />

      <Modal
        visible={isAdding}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeAddDialog}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-center px-5"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close add workout plan dialog"
            onPress={closeAddDialog}
            className="absolute inset-0 bg-black/70"
          />
          <View className="bg-surface-container rounded-3xl p-6 border border-surface-bright">
            <View className="flex-row items-start justify-between mb-5">
              <View className="flex-1 pr-4">
                <Text className="text-on-surface text-2xl font-bold">
                  New workout plan
                </Text>
                <Text className="text-on-variant text-base mt-2 leading-6">
                  Give your routine a name and an optional description.
                </Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Close dialog"
                onPress={closeAddDialog}
                disabled={isSaving}
                className="w-10 h-10 rounded-full bg-surface-bright items-center justify-center"
              >
                <X color="#e5e2e1" size={21} />
              </TouchableOpacity>
            </View>

            <Text className="text-on-surface text-base font-bold mb-2">
              Plan name
            </Text>
            <TextInput
              className="bg-surface-bright text-on-surface text-base px-4 py-4 rounded-xl mb-5"
              placeholder="e.g. Push Day, Upper Body"
              placeholderTextColor="#96938d"
              value={newPlanName}
              onChangeText={setNewPlanName}
              returnKeyType="next"
              autoFocus
              maxLength={60}
              editable={!isSaving}
              accessibilityLabel="Workout plan name"
            />

            <Text className="text-on-surface text-base font-bold mb-2">
              Description <Text className="text-on-variant font-normal">(optional)</Text>
            </Text>
            <TextInput
              className="bg-surface-bright text-on-surface text-base px-4 py-4 rounded-xl mb-6 min-h-24"
              placeholder="What will you focus on in this routine?"
              placeholderTextColor="#96938d"
              value={newPlanDesc}
              onChangeText={setNewPlanDesc}
              multiline
              textAlignVertical="top"
              maxLength={180}
              editable={!isSaving}
              accessibilityLabel="Workout plan description"
            />

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={closeAddDialog}
                disabled={isSaving}
                className="flex-1 rounded-xl py-4 mr-3 items-center border border-surface-bright"
              >
                <Text className="text-on-surface font-bold text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddPlan}
                disabled={isSaving || !newPlanName.trim()}
                className={`flex-1 rounded-xl py-4 items-center ${newPlanName.trim() ? "bg-primary" : "bg-surface-bright"}`}
                activeOpacity={0.8}
              >
                <Text className={`font-bold text-base ${newPlanName.trim() ? "text-on-primary" : "text-on-variant"}`}>
                  {isSaving ? "Creating..." : "Create plan"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
