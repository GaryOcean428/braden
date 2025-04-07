
import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface LogEntry {
  id: number;
  timestamp: Date;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  details?: any;
}

export const Debug = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'log'>('all');
  
  useEffect(() => {
    // Store original console methods
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };
    
    let logCounter = 0;
    
    // Override console methods
    console.log = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, {
        id: logCounter++,
        timestamp: new Date(),
        type: 'log',
        message,
        details: args.length > 0 ? args[0] : undefined
      }]);
      
      originalConsole.log(...args);
    };
    
    console.error = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, {
        id: logCounter++,
        timestamp: new Date(),
        type: 'error',
        message,
        details: args.length > 0 ? args[0] : undefined
      }]);
      
      originalConsole.error(...args);
    };
    
    console.warn = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, {
        id: logCounter++,
        timestamp: new Date(),
        type: 'warn',
        message,
        details: args.length > 0 ? args[0] : undefined
      }]);
      
      originalConsole.warn(...args);
    };
    
    console.info = (...args: any[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev, {
        id: logCounter++,
        timestamp: new Date(),
        type: 'info',
        message,
        details: args.length > 0 ? args[0] : undefined
      }]);
      
      originalConsole.info(...args);
    };
    
    // Restore original console on unmount
    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    };
  }, []);
  
  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.type === filter);
  
  const errorCount = logs.filter(log => log.type === 'error').length;
  const warnCount = logs.filter(log => log.type === 'warn').length;
  
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsOpen(true)} 
          variant="outline"
          className="flex items-center gap-2 bg-white border border-gray-200 shadow-lg"
        >
          <Code size={16} />
          <span>Debug</span>
          {(errorCount > 0 || warnCount > 0) && (
            <Badge variant={errorCount > 0 ? "destructive" : "warning"} className="ml-1">
              {errorCount > 0 ? errorCount : warnCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:w-2/3 lg:w-1/2 h-1/3 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-between p-3 border-b bg-[#2c3e50] text-white">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          <h2 className="font-semibold">Debug Console</h2>
          {errorCount > 0 && (
            <Badge variant="destructive" className="ml-2">{errorCount} Errors</Badge>
          )}
          {warnCount > 0 && (
            <Badge variant="warning" className="ml-1">{warnCount} Warnings</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded overflow-hidden">
            <Button 
              variant={filter === 'all' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter('all')}
              className="text-xs h-7 rounded-none"
            >
              All
            </Button>
            <Button 
              variant={filter === 'error' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter('error')}
              className="text-xs h-7 rounded-none"
            >
              Errors
            </Button>
            <Button 
              variant={filter === 'warn' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter('warn')}
              className="text-xs h-7 rounded-none"
            >
              Warnings
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLogs([])}
            className="text-xs h-7"
          >
            Clear
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-7 w-7"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-48px)]">
        {filteredLogs.length > 0 ? (
          <div className="p-0">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className={`p-2 border-b text-sm font-mono ${
                  log.type === 'error' ? 'bg-red-50' : 
                  log.type === 'warn' ? 'bg-yellow-50' : 
                  'bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <Badge 
                    variant={
                      log.type === 'error' ? 'destructive' : 
                      log.type === 'warn' ? 'warning' : 
                      log.type === 'info' ? 'info' : 
                      'outline'
                    }
                    className="text-xs py-0 px-1"
                  >
                    {log.type.toUpperCase()}
                  </Badge>
                  <span className={`flex-1 ${
                    log.type === 'error' ? 'text-red-700' : 
                    log.type === 'warn' ? 'text-yellow-700' : 
                    'text-gray-800'
                  }`}>
                    {log.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No logs to display
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
