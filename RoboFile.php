<?php
/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see https://robo.li/
 */
class RoboFile extends \Robo\Tasks
{
    // define public methods as commands
    public function buildImage()
    {
        $version = time();
        $this->_exec("docker build -t gpt4company . && docker tag gpt4company easychen/gpt4company:latest && docker push easychen/gpt4company:latest&& docker tag gpt4company easychen/gpt4company:$version && docker push easychen/gpt4company:$version");
        $this->say("Build image easychen/gpt4company:$version");
    }
}
