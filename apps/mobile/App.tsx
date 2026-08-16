import { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { schools } from "@compario/data";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function App() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      schools.filter((school) =>
        `${school.name} ${school.city} ${school.state}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>COMPARIO</Text>
        <Text style={styles.title}>Compare with evidence.</Text>
        <Text style={styles.subtitle}>25 optometry programs from the ASCO 2025-26 report.</Text>
        <TextInput
          accessibilityLabel="Search programs"
          style={styles.search}
          placeholder="Search school, city, or state"
          value={query}
          onChangeText={setQuery}
        />
        {filtered.map((school) => (
          <View style={styles.card} key={school.id}>
            <Text style={styles.code}>{school.ascoCode}</Text>
            <Text style={styles.name}>{school.name}</Text>
            <Text style={styles.location}>{school.city}, {school.state}</Text>
            <View style={styles.metric}>
              <Text>First-year tuition</Text>
              <Text style={styles.value}>{money.format(school.tuition.nonResident)}</Text>
            </View>
            <View style={styles.metric}>
              <Text>9-month living budget</Text>
              <Text style={styles.value}>{school.nineMonthLivingExpenses.value === null ? "Not reported" : money.format(school.nineMonthLivingExpenses.value)}</Text>
            </View>
            <View style={styles.metric}>
              <Text>Students leaving</Text>
              <Text style={styles.value}>{school.departureRate.value === null ? "N/A" : `${school.departureRate.value}%`}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f4ed" },
  content: { padding: 20, gap: 14 },
  eyebrow: { color: "#12614e", fontWeight: "800", letterSpacing: 2 },
  title: { color: "#17211d", fontFamily: "Georgia", fontSize: 42, fontWeight: "700", lineHeight: 44 },
  subtitle: { color: "#607069", fontSize: 17, lineHeight: 24, marginBottom: 10 },
  search: { backgroundColor: "white", borderColor: "#d8ddd7", borderWidth: 1, borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 4 },
  card: { backgroundColor: "#fffdf7", borderColor: "#d8ddd7", borderWidth: 1, borderRadius: 16, padding: 18 },
  code: { color: "#12614e", fontSize: 12, fontWeight: "800", letterSpacing: 1.5 },
  name: { color: "#17211d", fontFamily: "Georgia", fontSize: 21, fontWeight: "700", marginTop: 5 },
  location: { color: "#607069", marginTop: 5, marginBottom: 14 },
  metric: { flexDirection: "row", justifyContent: "space-between", borderTopColor: "#d8ddd7", borderTopWidth: 1, paddingTop: 9, marginTop: 9 },
  value: { fontWeight: "700" },
});

