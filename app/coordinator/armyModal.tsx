
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import {addPlayerModalVisibleAtom, useArmyTableItems} from "@/app/lib/storage/armyTableAtoms";
import {useAtom} from "jotai/index";
import {Container, Form, FormField, Header, Input} from "@cloudscape-design/components";
import {useState} from "react";

export const AddPlayerModal =  () => {
  const [addPlayerModalVisible, setAddPlayerModalVisible] = useAtom(addPlayerModalVisibleAtom);

  const [errorMessage, setErrorMessage] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerDescription, setPlayerDescription] = useState("")

  const closeAddPlayerModal = () => {
    setAddPlayerModalVisible(false);
    setErrorMessage("");
    setPlayerName("");
    setPlayerDescription("");
  }

  const {
    onArmyTableAddInput
  } = useArmyTableItems();

  return (
    <Modal
      onDismiss={closeAddPlayerModal}
      visible={addPlayerModalVisible}
      header="Add Player"
    >
        <form onSubmit={e => {
          console.log("SUBMIT BRO")
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