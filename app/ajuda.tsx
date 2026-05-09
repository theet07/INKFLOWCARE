import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Componente simples de Accordion
const AccordionItem = ({ title, content }: { title: string; content: string }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity 
        style={styles.accordionHeader} 
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#888" />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.accordionContent}>
          <Text style={styles.accordionText}>{content}</Text>
        </View>
      )}
    </View>
  );
};

export default function Ajuda() {
  const router = useRouter();

  const openEmail = () => {
    Linking.openURL('mailto:suporte@inkflowcare.com').catch(err => 
      console.error('Erro ao abrir e-mail', err)
    );
  };

  const faqData = [
    {
      q: "Como funciona o acompanhamento de cicatrização?",
      a: "Após a sua sessão de tatuagem, o InkFlowCare agenda lembretes diários para você enviar fotos e avaliar como está a cicatrização. Nosso sistema e o seu tatuador analisam para garantir que tudo está ocorrendo perfeitamente."
    },
    {
      q: "Como adicionar uma tatuagem externa?",
      a: "No seu perfil ou na tela inicial, procure o botão de '+' ou 'Nova Tatuagem'. Escolha a opção de Tatuagem Externa e preencha os dados da sessão, como nome do estúdio e data."
    },
    {
      q: "Como funciona o sistema de XP e estrelas?",
      a: "Você ganha XP e preenche estrelas ao enviar suas fotos diárias de cicatrização no prazo. Complete os acompanhamentos corretamente para ganhar conquistas e desbloquear recompensas!"
    },
    {
      q: "Como alterar meus dados de perfil?",
      a: "Acesse a aba 'Perfil' no menu inferior e clique no ícone de engrenagem (Configurações) ou no botão 'Editar Perfil'. Lá você pode atualizar seu nome e telefone."
    },
    {
      q: "Como deletar minha conta?",
      a: "Acesse as Configurações no seu Perfil, vá até a seção 'Privacidade' e no final da tela você encontrará a 'Zona de Perigo' com a opção para deletar sua conta definitivamente."
    }
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ajuda & Suporte</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 60 }}>
          
          {/* FAQ */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="help-circle" size={22} color="#ff8d8c" />
              <Text style={styles.sectionTitle}>Perguntas Frequentes</Text>
            </View>
            
            {faqData.map((faq, index) => (
              <AccordionItem key={index} title={faq.q} content={faq.a} />
            ))}
          </View>

          {/* Contato */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="mail" size={22} color="#ff8d8c" />
              <Text style={styles.sectionTitle}>Contato</Text>
            </View>
            <Text style={styles.sectionText}>
              Ainda com dúvidas ou enfrentando algum problema? Nossa equipe de suporte está pronta para ajudar.
            </Text>
            
            <TouchableOpacity style={styles.contactBtn} onPress={openEmail} activeOpacity={0.7}>
              <Ionicons name="send" size={20} color="#000" />
              <Text style={styles.contactBtnText}>Enviar e-mail</Text>
            </TouchableOpacity>
          </View>

          {/* Sobre o App */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="information-circle" size={22} color="#888" />
              <Text style={[styles.sectionTitle, { color: '#888' }]}>Sobre o App</Text>
            </View>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Versão</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Plataforma</Text>
              <Text style={styles.aboutValue}>InkFlowCare Studios</Text>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerBtn: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  scroll: {
    padding: 20,
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 10,
  },
  sectionText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
    marginBottom: 16,
  },
  
  // Accordion
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    marginBottom: 8,
    paddingBottom: 8,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#eee',
    flex: 1,
    paddingRight: 10,
  },
  accordionContent: {
    paddingVertical: 10,
    paddingRight: 10,
  },
  accordionText: {
    fontSize: 14,
    color: '#888',
    lineHeight: 22,
  },

  // Contact
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff8d8c',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  contactBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },

  // About
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  aboutLabel: {
    color: '#888',
    fontSize: 15,
  },
  aboutValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  }
});
