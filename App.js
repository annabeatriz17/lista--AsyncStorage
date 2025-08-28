import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar, FlatList } from "react-native";

export default function App() {
  const limparTudo = async () => {
    await AsyncStorage.removeItem("tarefas");
    setTarefas([]);
  };
  const [tarefa, setTarefa] = useState("");
  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function tarefasDaLista() {
      const tarefasSalvas = await AsyncStorage.getItem("tarefas");
      if (tarefasSalvas) {
        setTarefas(JSON.parse(tarefasSalvas));
      }
    }
    tarefasDaLista();
  }, []);

  const adicionarTarefa = async () => {
    if (tarefa.trim() === "") {
      alert("Digite uma tarefa");
      return;
    }
    const novaTarefa = { id: Date.now().toString(), texto: tarefa };
    const novaLista = [...tarefas, novaTarefa];
    await AsyncStorage.setItem("tarefas", JSON.stringify(novaLista));
    setTarefas(novaLista);
    setTarefa("");
    alert("Tarefa adicionada com sucesso");
  };

  const removerTarefa = async (id) => {
    const novaLista = tarefas.filter((item) => item.id !== id);
    await AsyncStorage.setItem("tarefas", JSON.stringify(novaLista));
    setTarefas(novaLista);
  };


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titulo}>Minhas Tarefas</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma tarefa"
          value={tarefa}
          onChangeText={setTarefa}
        />
        <View style={styles.doisBotao}>
        <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
          <Text style={styles.botaoTexto}>Adicionar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.limparTudoBotao} onPress={limparTudo}>
        <Text style={styles.limparTudoTexto}>Limpar Tudo</Text>
      </TouchableOpacity>
      </View>
      </View>
      {tarefas.length === 0 ? (
        <Text style={styles.nenhumaTarefa}>Nenhuma tarefa cadastrada.</Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.tarefaItem}>
              <Text style={styles.tarefaTexto}>{item.texto}</Text>
              <TouchableOpacity onPress={() => removerTarefa(item.id)}>
                <Text style={styles.removerTexto}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  doisBotao: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  botao: {
    flex: 1,
    backgroundColor: "#a91b60",
    borderRadius: 5,
    padding: 10,
    marginLeft: 0,
  },
  limparTudoBotao: {
    flex: 1,
    backgroundColor: "#ff0080",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  limparTudoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  nenhumaTarefa: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
    marginTop: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  botao: {
    backgroundColor: "#ff0080",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  tarefaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tarefaTexto: {
    fontSize: 18,
  },
  removerTexto: {
    color: "red",
  },
});
