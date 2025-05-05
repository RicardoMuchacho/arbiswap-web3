
import React from 'react';
import { Mail, Copyright, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {

    const linkedinURL = "https://www.linkedin.com/in/ricardo-muchacho-8400171b5";
    const githubURL = "https://github.com/RicardoMuchacho";

    return (
        <footer className="w-full backdrop-blur-sm bg-slate-950/30 border-t border-dex-border/20 py-4">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center text-dex-foreground/70">
                        <Copyright size={16} className="mr-2" />
                        <span>2025 ArbiSwap. All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-dex-foreground/70 hover:text-dex-primary hover:bg-dex-primary/10"
                            onClick={() => window.location.href = githubURL}
                        >
                            <Github size={24} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-dex-foreground/70 hover:text-dex-primary hover:bg-dex-primary/10"
                            onClick={() => window.location.href = linkedinURL}
                        >
                            <Linkedin size={24} className='' />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-dex-foreground/70 hover:text-dex-primary hover:bg-dex-primary/10"
                            onClick={() => window.location.href = 'mailto:ricardomuchacho.developer@gmail.com'}
                        >
                            <Mail size={24} className="mr-2" />
                            <span className="text-sm">ricardomuchacho.developer@gmail.com</span>
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
