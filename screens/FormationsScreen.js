import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  View,
  Text,
  Dimensions,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { FormationsService } from "../service/FormationService";
import { IMAGE_BASE_URL1 } from "@env";
import HTML from "react-native-render-html";

const { width } = Dimensions.get("window");

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const Overlay = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const FilterButton = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  background-color: #203a72;
  padding: 12px;
  border-radius: 25px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const SideMenuContainer = styled(Animated.View)`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: ${width * 0.85}px;
  background-color: #fff;
  z-index: 1;
  padding: 20px;
  padding-top: 60px;
  shadow-color: #000;
  shadow-offset: -2px 0px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 8px;
  z-index: 3;
`;

const SearchContainer = styled.View`
  margin-bottom: 20px;
`;

const SearchInput = styled.TextInput`
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 16px;
`;

const SearchButton = styled.TouchableOpacity`
  background-color: #203a72;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const SearchButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const FilterSection = styled.View`
  margin-bottom: 20px;
`;

const FilterTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #203a72;
  margin-bottom: 12px;
`;

const FilterScrollView = styled.ScrollView`
  max-height: 200px;
`;

const FilterOption = styled.TouchableOpacity`
  padding: 12px;
  background-color: ${(props) => (props.selected ? "#203a72" : "#f5f5f5")};
  border-radius: 8px;
  margin-bottom: 8px;
  elevation: ${(props) => (props.selected ? 3 : 1)};
`;

const FilterOptionText = styled.Text`
  color: ${(props) => (props.selected ? "#fff" : "#203a72")};
  font-size: 16px;
  font-weight: ${(props) => (props.selected ? "bold" : "normal")};
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: #f4a100;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
`;

const ApplyButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

const CardContainer = styled.TouchableOpacity`
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const CardImage = styled.Image`
  object-fit: fill;
  width: 100%;
  height: 180px;
`;

const CardDetails = styled.View`
  padding: 12px;
`;

const CardTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #203a72;
  margin-bottom: 4px;
`;

const CardDate = styled.Text`
  font-size: 14px;
  color: #757575;
`;

const NoResultsContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const NoResultsText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
`;

const FormationDetailsContainer = styled.View`
  padding: 20px;
`;

const StatsText = styled.Text`
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
`;

const FormationsScreen = () => {
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedNiveau, setSelectedNiveau] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    category: "Toutes",
    niveau: "Toutes",
    search: "",
  });

  const slideAnim = useRef(new Animated.Value(width)).current;
  const navigation = useNavigation();

  const categories = [
    { id: 0, label: "Toutes" },
    { id: 1, label: "Certifiante" },
    { id: 2, label: "Pratique" },
    { id: 3, label: "BootCamp" },
    { id: 4, label: "Cursus" },
  ];

  const niveaux = [
    { id: 0, label: "Toutes" },
    { id: 1, label: "Débutant" },
    { id: 2, label: "Intermédiaire" },
    { id: 3, label: "Avancé" },
    { id: 4, label: "Pas de prérequis" },
  ];

  const toggleFilter = () => {
    Keyboard.dismiss();
    if (!isFilterOpen) {
      setTempFilters({
        category: selectedCategory,
        niveau: selectedNiveau,
        search: searchQuery,
      });
    }

    Animated.timing(slideAnim, {
      toValue: isFilterOpen ? width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFilterOpen(!isFilterOpen);
  };

  const applyFilters = () => {
    setSelectedCategory(tempFilters.category);
    setSelectedNiveau(tempFilters.niveau);
    setSearchQuery(tempFilters.search);
    filterFormations(tempFilters);
    toggleFilter();
  };

  const filterFormations = (filters) => {
    let filtered = [...formations];

    if (filters.category !== "Toutes") {
      filtered = filtered.filter(
        (formation) => formation.categorie === filters.category
      );
    }

    if (filters.niveau !== "Toutes") {
      filtered = filtered.filter(
        (formation) => formation.niveau === filters.niveau
      );
    }

    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (formation) => formation.titre.toLowerCase().indexOf(searchLower) !== -1
      );
    }

    setFilteredFormations(filtered);
  };

  const fetchFormations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await FormationsService.getFormations();
      const allFormations = data["hydra:member"] || [];
      setFormations(allFormations);
      setFilteredFormations(allFormations);
    } catch (err) {
      setError("Erreur lors de la récupération des formations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  if (loading) {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#203a72" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red", fontSize: 16 }}>{error}</Text>
      </Container>
    );
  }

  return (
    <Container>
      <FilterButton onPress={toggleFilter}>
        <Ionicons name="filter" size={24} color="#fff" />
      </FilterButton>

      {isFilterOpen && <Overlay onPress={toggleFilter} />}

      <SideMenuContainer style={{ transform: [{ translateX: slideAnim }] }}>
        <CloseButton onPress={toggleFilter}>
          <Ionicons name="close" size={24} color="#203a72" />
        </CloseButton>

        <SearchContainer>
          <SearchInput
            placeholder="Rechercher une formation..."
            value={tempFilters.search}
            onChangeText={(text) =>
              setTempFilters((prev) => ({ ...prev, search: text }))
            }
          />
        </SearchContainer>

        <FilterSection>
          <FilterTitle>Catégories</FilterTitle>
          <FilterScrollView showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <FilterOption
                key={category.id}
                selected={tempFilters.category === category.label}
                onPress={() =>
                  setTempFilters((prev) => ({
                    ...prev,
                    category: category.label,
                  }))
                }
              >
                <FilterOptionText
                  selected={tempFilters.category === category.label}
                >
                  {category.label}
                </FilterOptionText>
              </FilterOption>
            ))}
          </FilterScrollView>
        </FilterSection>

        <FilterSection>
          <FilterTitle>Niveau</FilterTitle>
          <FilterScrollView showsVerticalScrollIndicator={false}>
            {niveaux.map((niveau) => (
              <FilterOption
                key={niveau.id}
                selected={tempFilters.niveau === niveau.label}
                onPress={() =>
                  setTempFilters((prev) => ({ ...prev, niveau: niveau.label }))
                }
              >
                <FilterOptionText
                  selected={tempFilters.niveau === niveau.label}
                >
                  {niveau.label}
                </FilterOptionText>
              </FilterOption>
            ))}
          </FilterScrollView>
        </FilterSection>

        <ApplyButton onPress={applyFilters}>
          <ApplyButtonText>Appliquer les filtres</ApplyButtonText>
        </ApplyButton>
      </SideMenuContainer>

      <FlatList
        data={filteredFormations}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 15, paddingTop: 60 }}
        ListEmptyComponent={
          <NoResultsContainer>
            <NoResultsText>
              Aucune formation ne correspond à vos critères
            </NoResultsText>
          </NoResultsContainer>
        }
        renderItem={({ item }) => (
          <CardContainer
            onPress={() =>
              navigation.navigate("FormationDetails", { formation: item })
            }
          >
            <CardImage
              source={{ uri: `${IMAGE_BASE_URL1}/${item.photofront}` }}
            />

            <CardDetails>
              <CardTitle>{item.titre}</CardTitle>

              {/* Display additional API data */}
              <FormationDetailsContainer>
                <StatsText>Total Inscrits: {item.totalinscrit}</StatsText>
                <StatsText>Nb Likes: {item.nblike}</StatsText>
                <StatsText>Nb Avis: {item.nbavis}</StatsText>

                {/* Render HTML description */}
                <HTML source={{ html: item.desccourt }} contentWidth={width} />
              </FormationDetailsContainer>
            </CardDetails>
          </CardContainer>
        )}
      />
    </Container>
  );
};

export default FormationsScreen;
