
import Modal from "@cloudscape-design/components/modal";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import {
  addPlayerModalVisibleAtom,
  addTownModalVisibleAtom,
  playerAtom,
  useArmyTableItems
} from "@/app/lib/storage/armyTableAtoms";
import {useAtom, useAtomValue} from "jotai/index";
import {Form, FormField, Header, Input, Select} from "@cloudscape-design/components";
import {useState} from "react";
import {InputPlayer, InputTown, Player} from "@/app/lib/objects/armyObjects";

export const AddPlayerModal =  () => {
  const [addPlayerModalVisible, setAddPlayerModalVisible] = useAtom(addPlayerModalVisibleAtom);

  const [errorMessage, setErrorMessage] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerDescription, setPlayerDescription] = useState("");

  const closeAddPlayerModal = () => {
    setAddPlayerModalVisible(false);
    setErrorMessage("");
    setPlayerName("");
    setPlayerDescription("");
  }

  const {
    onArmyTableAddInput
  } = useArmyTableItems();

  const onSubmit = () => {
    // Needs better validation method

    if (playerName.trim() === "") {
      setErrorMessage("Player name should not be empty.");
      return;
    }

    const inputPlayer: InputPlayer = {
      playerName: playerName,
      description: playerDescription,
    }

    onArmyTableAddInput([inputPlayer], [], []);
    closeAddPlayerModal();
  }

  return (
    <Modal
      onDismiss={closeAddPlayerModal}
      visible={addPlayerModalVisible}
      header="Add Player"
    >
        <form onSubmit={e => {
          onSubmit();
          e.preventDefault();
        }}>
          <Form
            actions={
              <SpaceBetween
                direction="horizontal"
                size="xs"
              >
                <Button formAction="none" variant="link" onClick={closeAddPlayerModal}>
                  Cancel
                </Button>
                <Button variant="primary">
                  Submit
                </Button>
              </SpaceBetween>
            }
            header={
              <Header variant="h3">Form header</Header>
            }
            errorText={errorMessage}
          >
              <SpaceBetween direction="vertical" size="l">
                <FormField label="Player Name">
                  <Input
                    value={playerName}
                    onChange={({detail}) => setPlayerName(detail.value)}
                  />
                </FormField>
                <FormField label="Description">
                  <Input
                    value={playerDescription}
                    onChange={({detail}) => setPlayerDescription(detail.value)}
                  />
                </FormField>
              </SpaceBetween>
          </Form>
        </form>
    </Modal>
  );
}

export const AddTownModal =  () => {
  const [addTownModalVisible, setAddTownModalVisible] = useAtom(addTownModalVisibleAtom);

  const players = useAtomValue(playerAtom);

  const [errorMessage, setErrorMessage] = useState("");
  const [townName, setTownName] = useState("");
  const [townDescription, setTownDescription] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [xPosStr, setXPosStr] = useState<string>("");
  const [yPosStr, setYPosStr] = useState<string>("");

  const closeAddTownModal = () => {
    setAddTownModalVisible(false);
    setErrorMessage("");
    setTownName("");
    setTownDescription("");
    setSelectedPlayer(null);
    setXPosStr("");
    setYPosStr("");
  }

  const {
    onArmyTableAddInput
  } = useArmyTableItems();

  const onSubmit = () => {
    if (selectedPlayer === null) {
      setErrorMessage("Select a player.")
      return
    }

    if (townName === "") {
      setErrorMessage("Town name must not be empty");
      return;
    }

    let xPosInt: number;
    let yPosInt: number;

    // TODO: update regular expression to make sure no leading zero, or allow for decimal if only zeros at end
    // Regular expression to check for valid integer strings (positive integers only)
    const isIntegerString: (str: string) => boolean = (str: string): boolean => /^-?\d+$/.test(str);

    if (xPosStr && isIntegerString(xPosStr) && yPosStr && isIntegerString(yPosStr)) {
      xPosInt = parseInt(xPosStr, 10);
      yPosInt = parseInt(yPosStr, 10);
    } else {
      setErrorMessage("Coordinates are invalid");
      return;
    }

    if (xPosInt > 1000 || xPosInt < -1000) {
      setErrorMessage("X coordinate is out of bounds");
      return;
    }

    if (yPosInt > 1000 || yPosInt < -3300) {
      setErrorMessage("Y coordinate is out of bounds");
      return;
    }

    const inputTown: InputTown = {
      townName: townName,
      description: townDescription,
      xPos: xPosInt,
      yPos: yPosInt,
      playerId: selectedPlayer.value,
    };

    onArmyTableAddInput([], [inputTown], []);
    closeAddTownModal();
  }

  return (
    <Modal
      onDismiss={closeAddTownModal}
      visible={addTownModalVisible}
      header="Add Town"
    >
      <form onSubmit={e => {
        onSubmit();
        e.preventDefault();
      }}>
        <Form
          actions={
            <SpaceBetween
              direction="horizontal"
              size="xs"
            >
              <Button formAction="none" variant="link" onClick={closeAddTownModal}>
                Cancel
              </Button>
              <Button variant="primary">
                Submit
              </Button>
            </SpaceBetween>
          }
          header={
            <Header variant="h3">Form header</Header>
          }
          errorText={errorMessage}
        >
          <SpaceBetween direction="vertical" size="l">
            <FormField label="Player">
              <Select
                selectedOption={selectedPlayer}
                onChange={({ detail }) =>
                  setSelectedPlayer(detail.selectedOption)
                }
                options={
                  Array.from(players).map(([playerId, player]: [string, Player]): {label: string, value: string} =>
                    {
                      return {
                        label: player.playerName,
                        value: playerId,
                      };
                    }
                  )
                }
                placeholder="Choose a player"
              />
            </FormField>
            <FormField label="Town Name">
              <Input
                value={townName}
                onChange={({detail}) => setTownName(detail.value)}
              />
            </FormField>
            <FormField label="Town Description">
              <Input
                value={townDescription}
                onChange={({detail}) => setTownDescription(detail.value)}
              />
            </FormField>
            <FormField
              stretch={true}
              label="Town Coordinates"
              description="Specify the X and Y coordinates of the town."
            >
              <SpaceBetween
                direction="horizontal"
                size="s"
              >
                <FormField
                  stretch={true}
                  description="X coordinate"
                >
                  <Input
                    inputMode="numeric"
                    type="number"
                    value={xPosStr}
                    onChange={({detail}) => setXPosStr(detail.value)}
                    placeholder="0"
                  />
                </FormField>
                <FormField
                  stretch={true}
                  description="Y coordinate"
                  constraintText="Use whole numbers."
                >
                  <Input
                    inputMode="numeric"
                    type="number"
                    value={yPosStr}
                    onChange={({detail}) => setYPosStr(detail.value)}
                    placeholder="0"
                  />
                </FormField>
              </SpaceBetween>
            </FormField>
          </SpaceBetween>
        </Form>
      </form>
    </Modal>
  );
}
