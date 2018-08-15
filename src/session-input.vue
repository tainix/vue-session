<template>
	<div>
		<input type="hidden" :name="$session.tokenParamName" :value="$session.getToken()" />
	</div>
</template>

<script>
export default {
  name: "session-input",
  props: ["name"]
};
</script>

<style>
</style>