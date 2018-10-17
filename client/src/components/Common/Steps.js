import React from 'react'
import { Icon, Step } from 'semantic-ui-react'

const Steps = () => (
    <Step.Group>
      <Step>
        <Icon name='in cart' />
        <Step.Content>
          <Step.Title>Pedido</Step.Title>
          <Step.Description>Armá tu pedido indicando archivo, material y dimensiones.</Step.Description>
        </Step.Content>
      </Step>

      <Step>
        <Icon name='payment' />
        <Step.Content>
          <Step.Title>Cotización</Step.Title>
          <Step.Description>Te lo cotizamos y lo pagás online.</Step.Description>
        </Step.Content>
      </Step>

      <Step>
        <Icon name='truck' />
        <Step.Content>
          <Step.Title>Envío</Step.Title>
          <Step.Description>Podés recibirlo en tu casa o pasar a buscarlo.</Step.Description>
        </Step.Content>
      </Step>
    </Step.Group>
);

export default Steps