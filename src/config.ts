import { updateConfig } from 'features/vk-data';
import bridge from "@vkontakte/vk-bridge";

bridge.subscribe(({ detail }) => {
  if (detail.type === 'VKWebAppUpdateConfig') {
    updateConfig(detail.data as unknown as any);
    const schemeAttribute = document.createAttribute('scheme');
    schemeAttribute.value = detail.data.scheme || 'bright_light';

    document.body.attributes.setNamedItem(schemeAttribute);
  }
});